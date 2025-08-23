'use strict';

module.exports = requestParser;

var _            = require('lodash'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer       = require('multer'),
    tmp          = require('tmp');

// Clean-up the temp directory, even if the app crashes
tmp.setGracefulCleanup();

/**
 * Parses the HTTP request into useful objects.
 * This middleware populates {@link Request#params}, {@link Request#headers}, {@link Request#cookies},
 * {@link Request#signedCookies}, {@link Request#query}, {@link Request#body}, and {@link Request#files}.
 *
 * @param   {requestParser.defaultOptions}  [options]
 * @returns {function[]}
 */
function requestParser(options) {
  // Override default options
  options = _.merge({}, requestParser.defaultOptions, options);

  return [
    cookieParser(options.cookie.secret, options.cookie),
    bodyParser.json(options.json),
    bodyParser.text(options.text),
    bodyParser.urlencoded(options.urlencoded),
    bodyParser.raw(options.raw),
    // Only process multipart requests with multer
    function(req, res, next) {
      if (req.get('Content-Type') && req.get('Content-Type').includes('multipart/')) {
        multer(options.multipart).any()(req, res, next);
      } else {
        next();
      }
    },
    // Transform multer 2.x req.files array to object for backward compatibility
    function(req, res, next) {
      if (req.files && Array.isArray(req.files)) {
        var filesObj = {};
        req.files.forEach(function(file) {
          // Transform multer 2.x file object to match multer 0.x structure
          var transformedFile = {
            fieldname: file.fieldname,
            originalname: file.originalname,
            name: file.filename, // Use server-generated filename for multer 0.x 'name' compatibility
            encoding: file.encoding,
            mimetype: file.mimetype,
            // Extract extension from originalname
            extension: file.originalname ? file.originalname.split('.').pop() : '',
            size: file.size,
            truncated: false, // multer 2.x doesn't provide this, assume false
            buffer: null, // we're using disk storage, so no buffer
            path: file.path
            // Note: excluding destination and filename as tests don't expect them
          };

          // For backward compatibility, don't use array if putSingleFilesInArray is false
          if (options.multipart.putSingleFilesInArray === false && !filesObj[file.fieldname]) {
            filesObj[file.fieldname] = transformedFile;
          } else {
            if (!filesObj[file.fieldname]) {
              filesObj[file.fieldname] = [];
            }
            filesObj[file.fieldname].push(transformedFile);
          }
        });
        req.files = filesObj;
      } else if (!req.files) {
        // Ensure req.files is always defined as an object (multer 0.x behavior)
        req.files = {};
      }
      
      // Compress sparse arrays in req.body for backward compatibility (only for multipart/form-data)
      if (req.body && typeof req.body === 'object' && 
          req.get('Content-Type') && req.get('Content-Type').includes('multipart/form-data')) {
        req.body = compressSparseArrays(req.body);
      }
      
      next();
    }
  ];

/**
 * Recursively compresses sparse arrays in an object, removing null/undefined elements
 * for backward compatibility with multer 0.x behavior
 */
function compressSparseArrays(obj) {
  if (Array.isArray(obj)) {
    // Filter out null and undefined elements for sparse arrays
    var filtered = obj.filter(function(item) {
      return item != null;
    });
    // Recursively process the filtered array
    return filtered.map(compressSparseArrays);
  } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    // Recursively process object properties, being more lenient about object types
    var result = {};
    try {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = compressSparseArrays(obj[key]);
        }
      }
      return result;
    } catch (e) {
      // If object traversal fails, return original object
      return obj;
    }
  }
  return obj;
}

  //
  // This code is for Multer 1.x.  But we're still using Multer 0.x until this bug is fixed:
  // https://github.com/expressjs/multer/issues/212
  //
  //// Create a Multer uploader
  //var uploader = multer(options.multipart);
  //
  ///**
  // * Parses multipart/form-data
  // */
  //function multipartFormData(req, res, next) {
  //  if (util.isSwaggerRequest(req) && req.swagger.params.length > 0) {
  //    var fileFields = [];
  //
  //    // Get all the "file" params
  //    req.swagger.params.forEach(function(param) {
  //      if (param.in === 'formData' && param.type === 'file') {
  //        fileFields.push({name: param.name, maxCount: 1});
  //      }
  //    });
  //
  //    // Handle the multipart/form-data (even if it doesn't have any file fields)
  //    var upload = uploader.fields(fileFields);
  //    upload(req, res, next);
  //  }
  //
  //  next();
  //}
}

requestParser.defaultOptions = {
  /**
   * Cookie parser options
   * (see https://github.com/expressjs/cookie-parser#cookieparsersecret-options)
   */
  cookie: {
    secret: undefined
  },

  /**
   * JSON body parser options
   * (see https://github.com/expressjs/body-parser#bodyparserjsonoptions)
   */
  json: {
    limit: '1mb',
    type: ['json', '*/json', '+json']
  },

  /**
   * Plain-text body parser options
   * (see https://github.com/expressjs/body-parser#bodyparsertextoptions)
   */
  text: {
    limit: '1mb',
    type: ['text/*']
  },

  /**
   * URL-encoded body parser options
   * (see https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)
   */
  urlencoded: {
    extended: true,
    limit: '1mb'
  },

  /**
   * Raw body parser options
   * (see https://github.com/expressjs/body-parser#bodyparserrawoptions)
   */
  raw: {
    limit: '5mb',
    type: 'application/*'
  },

  /**
   * Multipart form data parser options
   * (see https://github.com/expressjs/multer#options)
   */
  multipart: {
    // By default, use the system's temp directory, and clean-up when the app exits
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        var tempDir = tmp.dirSync({prefix: 'swagger-express-middleware-', unsafeCleanup: true}).name;
        cb(null, tempDir);
      },
      filename: function (req, file, cb) {
        // Generate unique filename using word characters only (multer 2.x default behavior for backward compatibility)
        cb(null, Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + (file.originalname.split('.').pop() || ''));
      }
    }),

    // the Swagger spec does not allow multiple file params with same name
    putSingleFilesInArray: false
  }
};
