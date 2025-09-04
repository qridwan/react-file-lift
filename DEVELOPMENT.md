# Development Guide 🛠️

This guide covers development setup, building, testing, and contributing to React File Lift.

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/qridwan/react-file-lift.git
cd react-file-lift

# Install dependencies
npm install
```

### Development Scripts

```bash
# Start development build with watch mode
npm run dev

# Build the package
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## Project Structure

```
react-file-lift/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── FileUploader.tsx  # Main uploader component
│   │   ├── Dropzone.tsx      # Drag & drop zone
│   │   └── FilePreview.tsx   # File preview component
│   ├── storage/              # Cloud storage providers
│   │   ├── aws.ts           # AWS S3 integration
│   │   ├── cloudinary.ts    # Cloudinary integration
│   │   ├── supabase.ts      # Supabase integration
│   │   └── index.ts         # Storage exports
│   ├── utils/               # Utility functions
│   │   ├── compression.ts   # Image compression
│   │   ├── file.ts         # File utilities
│   │   └── __tests__/      # Unit tests
│   ├── types/              # TypeScript definitions
│   ├── styles/             # CSS styles
│   └── index.ts            # Main export file
├── examples/               # Usage examples
├── dist/                   # Built package (generated)
└── docs/                   # Documentation
```

## Building

The package uses Rollup for building:

```bash
npm run build
```

This creates:

- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES modules build
- `dist/index.d.ts` - TypeScript definitions
- `dist/index.css` - Extracted CSS

## Testing

We use Jest with jsdom for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- Unit tests are located in `__tests__` folders
- Component tests use React Testing Library
- Utility functions have comprehensive test coverage

## Code Quality

### ESLint Configuration

- Extends recommended rules for TypeScript and React
- Enforces consistent code style
- Includes React Hooks rules

### TypeScript

- Strict mode enabled
- Full type coverage required
- No `any` types allowed in production code

## Contributing

### Development Workflow

1. **Fork and Clone**

   ```bash
   git fork https://github.com/qridwan/react-file-lift.git
   git clone your-fork-url
   cd react-file-lift
   npm install
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development**

   - Write code following existing patterns
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure TypeScript types are complete

4. **Testing**

   ```bash
   npm test
   npm run lint
   npm run type-check
   npm run build
   ```

5. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Fill out the PR template
   - Include examples of the new functionality
   - Link any related issues

### Commit Convention

We follow Conventional Commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process/tooling changes

### Adding New Storage Providers

To add a new storage provider:

1. Create `src/storage/new-provider.ts`
2. Implement the storage interface:
   ```typescript
   export class NewProviderStorage {
     async uploadFile(
       file: File,
       fileName?: string,
       onProgress?: (progress: number) => void
     ): Promise<string> {
       // Implementation
     }
   }
   ```
3. Add configuration types to `src/types/index.ts`
4. Update the factory in `src/storage/index.ts`
5. Add tests and documentation
6. Create example usage

### Performance Guidelines

- Use React.memo for components that receive complex props
- Implement proper cleanup for object URLs
- Use web workers for heavy operations when possible
- Optimize bundle size by avoiding large dependencies

### Security Considerations

- Never expose API secrets in client-side code
- Use environment variables for configuration
- Implement proper CORS policies
- Validate file types and sizes
- Sanitize file names

## Publishing

### Pre-release Checklist

- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript builds without errors
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is bumped
- [ ] Examples work correctly

### Release Process

1. **Version Bump**

   ```bash
   npm version patch|minor|major
   ```

2. **Build and Test**

   ```bash
   npm run build
   npm test
   ```

3. **Publish**

   ```bash
   npm publish
   ```

4. **Create Release**
   - Tag the release on GitHub
   - Write release notes
   - Include migration guide if needed

## Troubleshooting

### Common Issues

**Build Fails**

- Ensure all dependencies are installed
- Check TypeScript errors
- Verify Rollup configuration

**Tests Fail**

- Check Jest configuration
- Ensure test environment is set up correctly
- Verify mock implementations

**Type Errors**

- Update TypeScript definitions
- Check import/export statements
- Ensure peer dependencies are correct

### Getting Help

- Check existing issues on GitHub
- Review documentation and examples
- Join our Discord community
- Create a new issue with reproduction steps

## Architecture Decisions

### Why Rollup?

- Better tree-shaking for libraries
- Multiple output formats
- Smaller bundle sizes

### Why TypeScript?

- Better developer experience
- Compile-time error checking
- Excellent IDE support

### Why Separate Storage Providers?

- Modularity and maintainability
- Easy to add new providers
- Optional dependencies

### Component Design Principles

- Composition over inheritance
- Minimal required props
- Extensible styling system
- Accessible by default
