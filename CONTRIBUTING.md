# Contributing to Church Planner

Thank you for considering contributing to Church Planner! This document outlines the process for contributing to the project and how to get started.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**

* Check the [issues](https://github.com/yourusername/church-planner/issues) to see if the bug has already been reported.
* Perform a quick search to see if the problem has already been reported.

**How Do I Submit A Good Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title.
* Describe the exact steps to reproduce the problem.
* Provide specific examples to demonstrate the steps.
* Describe the behavior you observed after following the steps.
* Explain which behavior you expected to see instead and why.
* Include screenshots or animated GIFs if possible.
* Include details about your configuration and environment.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**

* Check if the enhancement has already been suggested.
* Determine which repository the enhancement should be suggested in.

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title.
* Provide a detailed description of the suggested enhancement.
* Explain why this enhancement would be useful to most Church Planner users.
* Include mockups or examples if applicable.

### Pull Requests

* Fill in the required template.
* Do not include issue numbers in the PR title.
* Include screenshots and animated GIFs in your pull request whenever possible.
* Follow the style guides.
* Include tests when adding new features.
* Update documentation when changing functionality.

## Development Process

### Setting Up the Development Environment

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/church-planner.git
   cd church-planner
   ```
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Set up environment variables:
   - Create a `.env` file in the server directory based on `.env.example`
5. Start the development servers:
   ```bash
   npm run dev
   ```

### Coding Standards

#### JavaScript/TypeScript

* Use TypeScript for all new code.
* Follow the ESLint configuration in the project.
* Use async/await instead of callbacks or promises.
* Use meaningful variable and function names.

#### React

* Use functional components with hooks.
* Keep components small and focused on a single responsibility.
* Use TypeScript interfaces for props.
* Use React Query for data fetching.

#### CSS/Styling

* Use Tailwind CSS for styling.
* Follow the design system defined in the project.
* Ensure responsive design for all components.

### Testing

* Write tests for all new features.
* Ensure all tests pass before submitting a pull request.
* Aim for good test coverage.

### Documentation

* Update documentation when changing functionality.
* Use JSDoc comments for functions and components.
* Keep the README and other documentation up to date.

## Git Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bugfix-name
   ```

2. Make your changes and commit them with a descriptive message:
   ```bash
   git commit -m "Add feature: your feature description"
   ```

3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request from your branch to the main repository.

## Review Process

* All pull requests require at least one review before merging.
* Address all review comments and update your pull request accordingly.
* Once approved, a maintainer will merge your pull request.

## Community

* Join our [Discord server](https://discord.gg/your-discord-link) for discussions.
* Follow us on [Twitter](https://twitter.com/your-twitter-handle) for updates.

Thank you for contributing to Church Planner! 