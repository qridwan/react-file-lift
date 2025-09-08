# Contributing to React File Lift 🚀

Thank you for your interest in contributing to React File Lift! This document provides comprehensive guidelines for contributing to our open-source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Bundle Optimization Guidelines](#bundle-optimization-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (LTS recommended)
- **Package Manager**: npm (v9+), yarn (v3+), or pnpm (v8+)
- **Git**: v2.30+ with proper configuration
- **IDE**: VS Code (recommended) with TypeScript and ESLint extensions

### Quick Start

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/react-file-lift.git
cd react-file-lift

# Install dependencies
npm install

# Verify installation
npm run verify-setup

# Start development
npm run dev
```

### Development Scripts

```bash
# Development
npm run dev              # Start development build with watch mode
npm run dev:demo         # Start demo app with hot reload

# Building
npm run build            # Build the package for production (with source maps)
npm run build:prod       # Build optimized package (no source maps)
npm run build:dev        # Build development version (with source maps)
npm run build:demo       # Build and copy to demo app
npm run build:watch      # Build with watch mode
npm run analyze          # Analyze bundle size and composition

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ci          # Run tests for CI environment

# Code Quality
npm run lint             # Lint all source files
npm run lint:fix         # Fix auto-fixable linting issues
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Package Management
npm run copy:demo        # Copy dist to demo app
npm run update:demo      # Build and update demo app
npm run publish:dry      # Dry run npm publish
```

## Development Setup

### Environment Configuration

1. **Clone and Setup**

   ```bash
   git clone https://github.com/qridwan/react-file-lift.git
   cd react-file-lift
   npm install
   ```

2. **Environment Variables**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Configure your cloud storage credentials
   # See CLOUD_SETUP.md for detailed instructions
   ```

3. **IDE Configuration**
   - Install recommended VS Code extensions
   - Configure Prettier and ESLint
   - Enable TypeScript strict mode

### Verification

```bash
# Verify your setup
npm run verify-setup

# This will check:
# - Node.js version compatibility
# - Dependencies installation
# - TypeScript configuration
# - ESLint configuration
# - Test environment setup
```

## Project Architecture

### Directory Structure

```
react-file-lift/
├── .github/                 # GitHub workflows and templates
│   ├── workflows/          # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                   # Documentation
│   ├── api/               # API documentation
│   ├── guides/            # User guides
│   └── examples/          # Code examples
├── examples/              # Standalone examples
│   ├── basic/             # Basic usage example
│   ├── cloudinary/        # Cloudinary integration
│   ├── aws-s3/           # AWS S3 integration
│   └── supabase/         # Supabase integration
├── react-file-lift-demo/  # Interactive demo app
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── FileUploader.tsx
│   │   ├── Dropzone.tsx
│   │   ├── FilePreview.tsx
│   │   └── __tests__/     # Component tests
│   ├── storage/           # Cloud storage providers
│   │   ├── aws.ts
│   │   ├── cloudinary.ts
│   │   ├── supabase.ts
│   │   ├── firebase.ts
│   │   ├── index.ts
│   │   └── __tests__/     # Storage tests
│   ├── utils/             # Utility functions
│   │   ├── compression.ts
│   │   ├── file.ts
│   │   └── __tests__/     # Utility tests
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── styles/            # CSS styles
│   │   └── index.css
│   └── index.ts           # Main export file
├── dist/                  # Built package (generated)
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── rollup.config.js      # Rollup configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Package configuration
```

### Architecture Principles

1. **Modular Design**: Each storage provider is independent
2. **Composition over Inheritance**: Components are composable
3. **Type Safety**: Full TypeScript coverage
4. **Performance First**: Optimized for bundle size and runtime
5. **Accessibility**: WCAG 2.1 AA compliant
6. **Extensibility**: Easy to add new features and providers

## Development Workflow

### Branch Strategy

We use [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) with the following branches:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development
- `bugfix/*`: Bug fixes
- `hotfix/*`: Critical production fixes
- `release/*`: Release preparation

### Feature Development Process

1. **Create Feature Branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Development Guidelines**

   - Write code following our [Code Standards](#code-standards)
   - Add comprehensive tests
   - Update documentation
   - Ensure TypeScript compliance
   - Follow accessibility guidelines

3. **Pre-commit Checks**

   ```bash
   npm run pre-commit
   # This runs: lint, type-check, test, build
   ```

4. **Commit Convention**
   We follow [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   feat: add new storage provider
   fix: resolve upload progress issue
   docs: update API documentation
   test: add unit tests for compression
   refactor: improve error handling
   perf: optimize bundle size
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR via GitHub interface
   ```

## Code Standards

### TypeScript Guidelines

1. **Strict Mode**: All code must pass strict TypeScript checks
2. **Type Definitions**: Export all public APIs with proper types
3. **No `any` Types**: Use proper typing or `unknown` when necessary
4. **Interface Design**: Prefer interfaces over types for object shapes
5. **Generic Constraints**: Use proper generic constraints

```typescript
// ✅ Good
interface FileUploaderProps {
  onFilesAdded: (files: FileWithPreview[]) => void;
  maxSize?: number;
  accept?: string;
}

// ❌ Bad
interface FileUploaderProps {
  onFilesAdded: (files: any) => void;
  maxSize?: any;
  accept?: any;
}
```

### React Best Practices

1. **Functional Components**: Use function components with hooks
2. **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` appropriately
3. **Custom Hooks**: Extract reusable logic into custom hooks
4. **Error Boundaries**: Implement proper error handling
5. **Accessibility**: Follow WCAG 2.1 AA guidelines

```typescript
// ✅ Good
const FileUploader = React.memo<FileUploaderProps>(
  ({ onFilesAdded, maxSize = 10 * 1024 * 1024, accept = "*/*" }) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const handleFilesAdded = useCallback(
      (newFiles: File[]) => {
        // Implementation
      },
      [onFilesAdded]
    );

    return (
      <div role="region" aria-label="File upload area">
        {/* Component content */}
      </div>
    );
  }
);
```

### Performance Guidelines

1. **Bundle Size**: Keep dependencies minimal
2. **Code Splitting**: Use dynamic imports for large features
3. **Memory Management**: Clean up object URLs and event listeners
4. **Rendering Optimization**: Minimize unnecessary re-renders

### Security Standards

1. **Input Validation**: Validate all file inputs
2. **XSS Prevention**: Sanitize user inputs
3. **CSRF Protection**: Use proper tokens for API calls
4. **Secrets Management**: Never expose API keys in client code

## Bundle Optimization Guidelines

React File Lift is optimized for minimal bundle size. Follow these guidelines to maintain our 94% size reduction:

### Core Principles

1. **Peer Dependencies**: Keep cloud storage providers as peer dependencies
2. **Tree Shaking**: Ensure all code is tree-shakeable
3. **Minimal Core**: Core functionality should be lightweight
4. **Optional Features**: Heavy features should be optional

### Bundle Size Targets

- **Core Package**: < 500KB total
- **Individual JS**: < 250KB (gzipped: < 80KB)
- **CSS**: < 10KB (minified)
- **TypeScript Definitions**: < 15KB

### Optimization Rules

#### ✅ DO

```typescript
// Use dynamic imports for heavy dependencies
const compressImage = async (file: File) => {
  const { default: imageCompression } = await import('browser-image-compression');
  return imageCompression(file, options);
};

// Make cloud providers external
export const createStorageProvider = (config: CloudStorageConfig) => {
  switch (config.provider) {
    case 'aws':
      // AWS SDK is external - user installs it
      return new AWSStorage(config.config as AWSConfig);
    case 'cloudinary':
      // Cloudinary is external - user installs it
      return new CloudinaryStorage(config.config as CloudinaryConfig);
  }
};

// Use peer dependencies in package.json
{
  "peerDependenciesMeta": {
    "@aws-sdk/client-s3": { "optional": true },
    "cloudinary": { "optional": true }
  }
}
```

#### ❌ DON'T

```typescript
// Don't bundle heavy dependencies
import AWS from 'aws-sdk'; // ❌ This adds 2MB+ to bundle
import cloudinary from 'cloudinary'; // ❌ This adds 1.5MB+ to bundle

// Don't include source maps in production
{
  "scripts": {
    "build": "rollup -c --sourcemap" // ❌ Adds 5MB+ source maps
  }
}

// Don't bundle unused code
import { everything } from 'large-library'; // ❌ Imports entire library
```

### Rollup Configuration

Our optimized Rollup config includes:

```javascript
// External dependencies (not bundled)
external: [
  'react',
  'react-dom',
  '@aws-sdk/client-s3',
  '@aws-sdk/s3-request-presigner',
  '@supabase/supabase-js',
  'firebase',
  'cloudinary',
  'browser-image-compression'
],

// Tree shaking optimization
treeshake: {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  tryCatchDeoptimization: false,
},

// No source maps in production
sourcemap: false,
compact: true
```

### Adding New Features

When adding new features:

1. **Check Bundle Impact**: Run `npm run analyze` to see bundle size
2. **Use Peer Dependencies**: For heavy libraries, make them peer dependencies
3. **Lazy Loading**: Use dynamic imports for optional features
4. **Tree Shaking**: Ensure new code is tree-shakeable

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check production build size
npm run build:prod
ls -la dist/

# Compare before/after
npm run build:dev  # With source maps
npm run build:prod # Without source maps
```

### Performance Monitoring

- **Bundle Size**: Monitor total package size
- **Gzip Size**: Check compressed size
- **Tree Shaking**: Verify unused code is removed
- **Load Time**: Test actual loading performance

### Common Pitfalls

1. **Accidental Imports**: Don't import entire libraries
2. **Source Maps**: Don't include in production builds
3. **Dependencies**: Don't add heavy deps to main package
4. **Polyfills**: Don't include polyfills unless necessary

## Testing Guidelines

### Testing Strategy

We follow a comprehensive testing strategy:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Visual Regression Tests**: Ensure UI consistency
5. **Performance Tests**: Monitor bundle size and runtime performance

### Test Structure

```
src/
├── components/
│   ├── FileUploader.tsx
│   └── __tests__/
│       ├── FileUploader.test.tsx
│       ├── FileUploader.integration.test.tsx
│       └── FileUploader.visual.test.tsx
├── utils/
│   ├── compression.ts
│   └── __tests__/
│       ├── compression.test.ts
│       └── compression.performance.test.ts
└── __mocks__/           # Mock implementations
    ├── fileMock.ts
    └── storageMock.ts
```

### Testing Commands

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual

# Performance tests
npm run test:performance
```

### Test Requirements

1. **Coverage**: Minimum 90% code coverage
2. **Accessibility**: Test with screen readers
3. **Cross-browser**: Test in major browsers
4. **Mobile**: Test on mobile devices
5. **Performance**: Meet performance budgets

### Writing Tests

```typescript
// Component test example
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileUploader } from "../FileUploader";

describe("FileUploader", () => {
  it("should accept files via drag and drop", async () => {
    const onFilesAdded = jest.fn();
    render(<FileUploader onFilesAdded={onFilesAdded} />);

    const dropzone = screen.getByRole("region", { name: /file upload area/i });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(["content"], "test.txt", { type: "text/plain" })],
      },
    });

    await waitFor(() => {
      expect(onFilesAdded).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: "test.txt" })])
      );
    });
  });
});
```

## Documentation Standards

### Code Documentation

1. **JSDoc Comments**: Document all public APIs
2. **README Updates**: Update relevant documentation
3. **API Documentation**: Maintain up-to-date API docs
4. **Examples**: Provide working code examples
5. **Changelog**: Document all changes

````typescript
/**
 * Uploads a file to the configured cloud storage provider
 * @param file - The file to upload
 * @param fileName - Optional custom file name
 * @param onProgress - Optional progress callback
 * @returns Promise that resolves to the uploaded file URL
 * @throws {Error} When upload fails or configuration is invalid
 * @example
 * ```typescript
 * const url = await uploadFile(file, 'custom-name.jpg', (progress) => {
 *   console.log(`Upload progress: ${progress}%`);
 * });
 * ```
 */
async uploadFile(
  file: File,
  fileName?: string,
  onProgress?: (progress: number) => void
): Promise<string>
````

### README Requirements

1. **Installation**: Clear installation instructions
2. **Quick Start**: Simple usage example
3. **API Reference**: Complete API documentation
4. **Examples**: Multiple usage examples
5. **Troubleshooting**: Common issues and solutions

## Pull Request Process

### PR Requirements

1. **Title**: Use conventional commit format
2. **Description**: Detailed description of changes
3. **Tests**: All tests must pass
4. **Coverage**: Maintain test coverage
5. **Documentation**: Update relevant docs
6. **Breaking Changes**: Document any breaking changes

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: At least 2 reviewers
3. **Testing**: All tests must pass
4. **Documentation**: Review documentation changes
5. **Approval**: Maintainer approval required

## Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript builds without errors
- [ ] Bundle size within limits (< 500KB total)
- [ ] No source maps in production build
- [ ] Peer dependencies properly configured
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is bumped
- [ ] Examples work correctly
- [ ] Performance benchmarks met
- [ ] Security audit passed

### Release Workflow

1. **Create Release Branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   ```

2. **Update Version and Changelog**

   ```bash
   npm version minor
   # Update CHANGELOG.md
   ```

3. **Bundle Size Check**

   ```bash
   # Build optimized package
   npm run build:prod

   # Check bundle size
   ls -la dist/
   # Should be < 500KB total

   # Analyze bundle composition
   npm run analyze
   ```

4. **Final Testing**

   ```bash
   npm run test:ci
   npm run build
   npm run test:integration
   ```

5. **Merge and Tag**

   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

6. **Publish**

   ```bash
   npm publish
   ```

7. **Create GitHub Release**
   - Write release notes
   - Include migration guide if needed
   - Announce in community channels

## Community Guidelines

### Communication

1. **Issues**: Use GitHub issues for bug reports and feature requests
2. **Discussions**: Use GitHub Discussions for questions and ideas
3. **Discord**: Join our Discord for real-time chat
4. **Email**: Contact maintainers for security issues

### Getting Help

1. **Documentation**: Check existing docs first
2. **Issues**: Search existing issues
3. **Discussions**: Ask in discussions
4. **Discord**: Join our community
5. **Create Issue**: If nothing else helps

### Recognition

We recognize contributors through:

- **Contributors List**: Listed in README
- **Release Notes**: Mentioned in release notes
- **Badges**: GitHub contributor badges
- **Swag**: Contributor swag for significant contributions

### Adding New Storage Providers

To add a new storage provider:

1. **Create Provider Class**

   ```typescript
   // src/storage/new-provider.ts
   export class NewProviderStorage {
     private config: NewProviderConfig;

     constructor(config: NewProviderConfig) {
       this.config = config;
     }

     async uploadFile(
       file: File,
       fileName?: string,
       onProgress?: (progress: number) => void
     ): Promise<string> {
       // Implementation with proper error handling
     }
   }
   ```

2. **Add Configuration Types**

   ```typescript
   // src/types/index.ts
   export interface NewProviderConfig {
     apiKey: string;
     bucket: string;
     region?: string;
   }
   ```

3. **Update Factory Pattern**

   ```typescript
   // src/storage/index.ts
   export function createStorageProvider(config: CloudStorageConfig) {
     switch (config.provider) {
       case "new-provider":
         return new NewProviderStorage(config.config as NewProviderConfig);
       // ... other providers
     }
   }
   ```

4. **Add Comprehensive Tests**

   ```typescript
   // src/storage/__tests__/new-provider.test.ts
   describe("NewProviderStorage", () => {
     it("should upload file successfully", async () => {
       // Test implementation
     });
   });
   ```

5. **Create Documentation and Examples**
   - Add to README
   - Create example usage
   - Update API documentation

## Performance Guidelines

### Bundle Optimization

1. **Tree Shaking**: Use ES modules for better tree shaking
2. **Code Splitting**: Split large features into separate chunks
3. **Dependency Analysis**: Regular bundle analysis
4. **Dead Code Elimination**: Remove unused code

### Runtime Performance

1. **Memoization**: Use React.memo for expensive components
2. **Callback Optimization**: Use useCallback for event handlers
3. **State Updates**: Minimize unnecessary re-renders
4. **Memory Management**: Clean up resources properly

### Performance Budgets

- **Initial Bundle**: < 100KB gzipped
- **Runtime Memory**: < 50MB for file operations
- **Upload Speed**: > 1MB/s for large files
- **Time to Interactive**: < 2s

## Security Considerations

### Input Validation

1. **File Types**: Validate MIME types and extensions
2. **File Sizes**: Enforce size limits
3. **File Names**: Sanitize and validate file names
4. **Content Scanning**: Scan for malicious content

### API Security

1. **Authentication**: Use secure authentication methods
2. **Authorization**: Implement proper access controls
3. **Rate Limiting**: Prevent abuse
4. **CORS**: Configure proper CORS policies

### Data Protection

1. **Encryption**: Encrypt sensitive data in transit
2. **Secrets**: Never expose API keys in client code
3. **Privacy**: Handle user data responsibly
4. **Compliance**: Follow GDPR and other regulations

## Troubleshooting

### Common Issues

**Build Fails**

- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript configuration
- Review Rollup configuration

**Tests Fail**

- Ensure test environment is properly configured
- Check mock implementations
- Verify test data setup
- Review Jest configuration

**Type Errors**

- Update TypeScript definitions
- Check import/export statements
- Verify peer dependencies
- Review type declarations

**Runtime Errors**

- Check browser compatibility
- Verify API configurations
- Review error logs
- Test with different file types

### Debug Tools

1. **Browser DevTools**: Use for debugging
2. **React DevTools**: Component debugging
3. **Bundle Analyzer**: Analyze bundle size
4. **Performance Profiler**: Identify bottlenecks

## Architecture Decisions

### Technology Choices

**Rollup**

- Better tree-shaking for libraries
- Multiple output formats (CJS, ESM)
- Smaller bundle sizes
- Better plugin ecosystem

**TypeScript**

- Better developer experience
- Compile-time error checking
- Excellent IDE support
- Better refactoring capabilities

**Jest + React Testing Library**

- Comprehensive testing framework
- Great React component testing
- Excellent mocking capabilities
- Good performance

**Modular Storage Providers**

- Easy to add new providers
- Optional dependencies
- Better maintainability
- Clear separation of concerns

### Design Principles

1. **Composition over Inheritance**: Components are composable
2. **Minimal API Surface**: Simple, focused APIs
3. **Progressive Enhancement**: Works without JavaScript
4. **Accessibility First**: WCAG 2.1 AA compliant
5. **Performance by Default**: Optimized out of the box

## Contributing to Documentation

### Documentation Types

1. **API Documentation**: JSDoc comments
2. **User Guides**: Step-by-step tutorials
3. **Examples**: Working code samples
4. **Architecture Docs**: Technical decisions
5. **Contributing Guide**: This document

### Writing Guidelines

1. **Clear and Concise**: Easy to understand
2. **Examples**: Include working code
3. **Up-to-date**: Keep documentation current
4. **Searchable**: Use proper headings and keywords
5. **Accessible**: Follow accessibility guidelines

---

## Thank You! 🙏

Thank you for contributing to React File Lift! Your contributions help make this project better for everyone. If you have any questions or need help, don't hesitate to reach out to our community.

**Happy Coding!** 🚀
