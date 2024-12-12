# Contributing to Commerce SDK

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Scopes

- `sdk`: Core SDK functionality
- `charges`: Charges-related features
- `webhooks`: Webhook-related features
- `docs`: Documentation
- `deps`: Dependencies
- `ci`: CI/CD related

### Examples

```bash
# Feature with breaking change
feat(sdk)!: add new payment method API

BREAKING CHANGE: The payment method API now requires additional parameters

# Simple feature
feat(charges): add support for recurring charges

# Bug fix
fix(webhooks): correct signature verification logic

# Documentation update
docs(README): update installation instructions

# Performance improvement
perf(sdk): optimize API request batching

# Dependency update
chore(deps): update typescript to v5
```

### Breaking Changes

Breaking changes must include `BREAKING CHANGE:` in the commit message body or use the `!` after the type/scope.
