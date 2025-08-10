# Copilot Instructions for the Starter Team 02 Repository

This repostiory has a Spring Boot backend and a React frontend.

## Repository Structure
* Top level follows the maven standard directory layout, except for the `frontend/` directory which contains the React frontend code.
* `src/main/java/`: Contains the main application code
* `src/main/resources/`: Contains configuration files and templates
* `src/test/java/`: Contains unit tests and integration tests
* `src/test/resources/`: Contains test resources and fixtures
* `frontend/`: Contains the React frontend code
* `frontend/src`: Code for the React frontend application
* `frontend/public`: Static assets for the React frontend application

## Code Standards

### Required Before Each Commit 

#### frontend code (all code under `frontend/` directory)
- Use `npm run format` to format the frontend code using `prettier`
- Use `npx eslint --fix .` to fix any linting issues in the frontend code
- Use `npm test` to make sure that the frontend tests pass, and that there is full test coverage (100%)
- Use `npm run build` to ensure that there are no build errors in the frontend code.
- Use `npx stryker run` to ensure that all mutations are killed and that the mutation testing score is at 100%.

#### backend code (all code under src)
- Use `mvn test` to run the backend tests
- Use `mvn test jacoco:report` to generate a code coverage report and ensure that the coverage is 100%
- Use `mvn pitest:mutationCoverage` to ensure that all mutations are killed and that the mutation testing score is at 100%.

## Key Guidelines
1. Follow Spring Boot best practices and idiomatic patterns for Java Code
2. Follow React best practices and idiomatic patterns for frontend code
3. Maintain existing code structure and organization

