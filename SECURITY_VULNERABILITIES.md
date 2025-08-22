# Security Vulnerabilities Report

Generated: 2025-08-22

## Summary

Total vulnerabilities found: **93**
- Critical: 16
- High: 43
- Moderate: 26
- Low: 8

## Critical Vulnerabilities (16)

### 1. underscore (1.3.2 - 1.12.0)
- **Severity**: Critical
- **CVSS Score**: 9.8
- **Issue**: Arbitrary Code Execution in underscore
- **CVE**: [GHSA-cf4h-3jhx-xvhq](https://github.com/advisories/GHSA-cf4h-3jhx-xvhq)
- **Fix Available**: Yes - Update to version >=1.12.1

### 2. minimist (<0.2.1 || >=1.0.0 <1.2.6)
- **Severity**: Critical  
- **CVSS Score**: 9.8
- **Issue**: Prototype Pollution in minimist
- **CVE**: [GHSA-xvch-5gv4-984h](https://github.com/advisories/GHSA-xvch-5gv4-984h)
- **Fix Available**: Yes - Update to version >=1.2.6

### 3. json5 (<1.0.2 || >=2.0.0 <2.2.2)
- **Severity**: Critical
- **CVSS Score**: 9.1
- **Issue**: Prototype Pollution in JSON5
- **CVE**: [GHSA-9c47-m6qq-7p4h](https://github.com/advisories/GHSA-9c47-m6qq-7p4h)
- **Fix Available**: Yes - Update to version >=2.2.2

### 4. lodash (<4.17.11)
- **Severity**: Critical
- **CVSS Score**: 9.1
- **Issue**: Command Injection in lodash
- **CVE**: [GHSA-35jh-r3h4-6jhm](https://github.com/advisories/GHSA-35jh-r3h4-6jhm)
- **Fix Available**: Yes - Update to version >=4.17.11
- **Note**: Currently using version 3.10.1 (direct dependency)

## High Vulnerabilities (43)

### Key High-Risk Dependencies:

#### body-parser (1.18.3) - Direct Dependency
- **Issue**: Denial of service when URL encoding is enabled
- **CVE**: [GHSA-qwcr-r2fm-qrc7](https://github.com/advisories/GHSA-qwcr-r2fm-qrc7)
- **Fix**: Update to version >=1.20.3

#### debug (<2.6.9) - Direct Dependency
- **Issue**: Regular Expression Denial of Service
- **CVE**: [GHSA-gxpj-cx7g-858c](https://github.com/advisories/GHSA-gxpj-cx7g-858c)
- **Fix**: Update to version >=2.6.9

#### express (4.16.3) - Peer Dependency
- **Issue**: Open redirect allow list bypass
- **CVE**: [GHSA-rv95-896h-c2vc](https://github.com/advisories/GHSA-rv95-896h-c2vc)
- **Fix**: Update to version >=4.20.0

#### mocha (5.2.0) - Dev Dependency
- **Issue**: Code injection in mocha
- **CVE**: [GHSA-36jr-mh4h-2g58](https://github.com/advisories/GHSA-36jr-mh4h-2g58)
- **Fix**: Update to version >=10.1.0

#### multer (0.1.8) - Direct Dependency
- **Issue**: Inadequate Input Validation
- **CVE**: [GHSA-4w2j-2rg4-5mjw](https://github.com/advisories/GHSA-4w2j-2rg4-5mjw)
- **Fix**: Update to version >=1.4.4-lts.1

## Moderate Vulnerabilities (26)

### Notable Moderate-Risk Dependencies:

#### ajv (<6.12.3) - Direct Dependency
- **Issue**: Prototype Pollution
- **CVSS Score**: 5.6
- **CVE**: [GHSA-v88g-cgmw-v5xw](https://github.com/advisories/GHSA-v88g-cgmw-v5xw)
- **Fix**: Update to version >=6.12.3

#### cookie-parser (<1.4.6) - Direct Dependency
- **Issue**: Cookie signature verification bypass
- **CVE**: [GHSA-p8p7-x288-28g6](https://github.com/advisories/GHSA-p8p7-x288-28g6)
- **Fix**: Update to version >=1.4.6

## Recommended Actions

### Immediate Actions (Critical & High Priority)
1. **Update lodash** from 3.10.1 to latest 4.x version
2. **Update body-parser** from 1.18.3 to >=1.20.3
3. **Update debug** from 2.2.0 to >=2.6.9
4. **Update multer** from 0.1.8 to >=1.4.4-lts.1
5. **Update express** peer dependency to >=4.20.0

### Secondary Actions (Moderate Priority)
1. **Update ajv** from 6.5.4 to >=6.12.3
2. **Update cookie-parser** from 1.3.5 to >=1.4.6
3. **Update mocha** from 5.2.0 to >=10.1.0

### Remediation Commands

```bash
# Fix all automatically fixable vulnerabilities
npm audit fix

# For breaking changes, update major versions manually
npm install lodash@latest
npm install body-parser@latest
npm install debug@latest
npm install multer@latest
npm install ajv@latest
npm install cookie-parser@latest
npm install --save-dev mocha@latest

# After updates, run tests to ensure compatibility
npm test
```

## Notes
- Many vulnerabilities are in transitive dependencies
- Some fixes may require major version updates which could introduce breaking changes
- Test thoroughly after applying updates
- Consider using `npm audit fix --force` only after backing up your project
- Regular dependency updates and security audits are recommended

## Resources
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Advisory Database](https://github.com/advisories)
- [National Vulnerability Database](https://nvd.nist.gov/)