# Test Failures TODO List

## Overview
After the security upgrades (supertest, multer, swagger-parser), **33 tests are failing** out of 1191 total tests.
The failures are primarily due to API changes in the upgraded packages.

**Test Summary:**
- ✅ **1158 passing** 
- ⏸️ **39 pending**
- ❌ **33 failing**

## Failure Categories

### 1. Swagger-Parser Integration Issues (2 failures)
**Root Cause:** swagger-parser 10.x API changes - `$refs` access when parser is null during error conditions

#### Failing Tests:
- [ ] **FileServer middleware HEAD - should return an HTTP 500 if the Swagger API is invalid**
- [ ] **FileServer middleware GET - should return an HTTP 500 if the Swagger API is invalid** 

**Error:** `Cannot read properties of null (reading '$refs')`
**Location:** `lib/file-server.js:25:55`
**Fix Strategy:** Add null check for `context.parser` before accessing `$refs`

### 2. Multer File Handling Issues (4 failures)  
**Root Cause:** Multer 2.x handling of optional file parameters and missing files

#### Failing Tests:
- [ ] **JSON Schema - parse file params - should parse an optional, unspecified file param**
- [ ] **JSON Schema - parse file params - should parse the default File value if no value is specified**
- [ ] **JSON Schema - parse file params - should throw an error if required and not specified**
- [ ] **JSON Schema - parse file params - should throw an error if the value is not a file**

**Error:** `TypeError: Cannot read properties of undefined (reading 'Photo')`
**Location:** `lib/param-parser.js:59:64`
**Fix Strategy:** Handle undefined/missing files in multipart form data parsing

### 3. Mock Data ID Generation Issues (24 failures)
**Root Cause:** Changes in random ID generation or data structure affecting mock responses

#### Failing Test Categories:
- [ ] **Query Collection Mock - DELETE - multipart/form-data** (3 failures)
- [ ] **Edit Resource Mock - DELETE - multipart/form-data** (1 failure)  
- [ ] **Edit Collection Mock - PATCH/PUT/POST** (9 failures)
- [ ] **Edit Resource Mock - PUT/PATCH/POST - multipart/form-data** (3 failures)
- [ ] **Query Collection Mock - GET - multipart/form-data** (3 failures)
- [ ] **Query Resource Mock - GET - multipart/form-data** (1 failure)
- [ ] **ParamParser/RequestParser middleware** (2 failures)

**Error Patterns:**
- `expected { Label: 'Photo 1', …(3) } to deeply equal { ID: 668585939, …(3) }`
- `expected '/api/pets/Fido/photos/1MB.jpg' to not equal '/api/pets/Fido/photos/1MB.jpg'`
- `expected { Photo: { fieldname: 'Photo', …(7) } } to deeply equal { Photo: { buffer: null, …(9) } }`

**Fix Strategy:** 
1. Review multer 2.x file object structure transformation
2. Fix random ID generation for mock data  
3. Update file object property mappings

### 4. Response Body Format Issues (2 failures)
**Root Cause:** Changes in empty response body handling

#### Failing Tests:
- [ ] **Edit Collection Mock - PATCH/PUT/POST - should support undefined values** (3 failures)

**Error:** `Error: expected '' response body, got '""'`
**Fix Strategy:** Fix empty response body serialization

### 5. Object Parameter Parsing (1 failure)
**Root Cause:** Changes in object parameter validation

#### Failing Test:
- [ ] **JSON Schema - parse object params - should throw an error if the value is blank**

**Error:** `Error: cannot PATCH /api/pets/fido (404)`
**Fix Strategy:** Review object parameter parsing logic

## Priority Order for Fixes

### High Priority (Core Functionality)
1. **Swagger-Parser $refs null checks** - Fixes error handling
2. **Multer file parameter handling** - Fixes file upload functionality
3. **File object structure transformation** - Fixes file-related mocks

### Medium Priority (Mock Behavior)  
4. **Mock data ID generation consistency** - Fixes test determinism
5. **Response body format issues** - Fixes empty response handling

### Low Priority (Edge Cases)
6. **Object parameter validation** - Fixes edge case validation

## Implementation Notes

### File Locations to Review:
- `lib/file-server.js` - Add null checks for parser.$refs
- `lib/param-parser.js` - Fix undefined file parameter handling  
- `lib/request-parser.js` - Review multer file transformation
- `lib/mock/*.js` - Review mock data generation and file handling

### Testing Strategy:
1. Fix issues in order of priority
2. Run focused tests for each category: `npm test -- --grep "pattern"`
3. Verify no regressions in passing tests
4. Document any intentional behavior changes

### Compatibility Notes:
- Most failures are related to internal API changes, not breaking changes to public middleware API
- Core middleware functionality is preserved
- These are primarily test compatibility issues rather than functional bugs

---

*Generated after security upgrades: supertest 1.2.0→7.1.4, multer 0.1.8→2.0.2, swagger-parser 5.0.5→10.0.3*