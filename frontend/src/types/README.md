# TypeScript Types Organization

This project follows best practices for organizing TypeScript types by centralizing all type definitions in the `src/types/` folder.

## Structure

```
src/types/
├── index.ts          # Central export file
├── issue.ts          # Issue-related types
├── user.ts           # User and profile types
├── settings.ts       # Application settings types
├── dashboard.ts      # Dashboard and analytics types
└── forms.ts          # Form data types
```

## Usage

Import types from the central index:

```typescript
import { Issue, UserProfile, IssueStats } from '../types';
```

Or import specific types from individual files:

```typescript
import type { Issue } from '../types/issue';
import type { UserProfile } from '../types/user';
```

## Benefits

- **Centralized**: All types in one location
- **Maintainable**: Easy to find and update types
- **Reusable**: Types can be shared across components
- **Type Safety**: Better IntelliSense and error checking
- **Organization**: Clear separation of concerns

## Best Practices

1. **Type-only imports**: Use `import type` for type imports when `verbatimModuleSyntax` is enabled
2. **Interface naming**: Use PascalCase for interface names
3. **Type unions**: Use type aliases for unions (e.g., `IssueStatus`)
4. **Documentation**: Add comments for complex types
5. **Consistency**: Follow the established patterns

## Adding New Types

1. Add the type definition to the appropriate file
2. Export it from the file
3. Add it to the central `index.ts` export
4. Update component imports as needed