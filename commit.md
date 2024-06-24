Below is a description of the rules and instructions for use:

```
type-enum: Specifies that the commitment types must belong to the list of defined commitment types. The commit types defined in the example are:

- feature: New feature.
- bug-fix: Bug fix.
- hot-fix: Quick fix.
- improvement: Improved code.
- refactor: Refactor the code.
- docs: Add documents.
- chores: Small changes during development.
- style: Edit text and formatting, does not affect logic.
- test: Written Test.
- revert: Undo the previous commit.
- ci: Change CI/CD configuration.
- build: Build file.
- type-case: Specifies that the type of commit must be written frequently.

- type-empty: Specifies that the commit type cannot be empty.

- empty scope: Specifies that the commitment range (scope) cannot be empty.

- topic-empty: Specifies that the commit subject cannot be empty.

- topic-full-stop: Specifies that the commit (topic) cannot end with a period.

- header-max-length: Specifies that the maximum length of the commit message is 72 characters.
```

Standard commit messages are often accompanied by commit message conventions (commit message rules). Here is an example of a standard commit message:

In which:

`<type>`: Type of commit, such as feat (new feature), bug fix (bug fix), doc (documentation), chore (small development change), and more other. Specifying commitment types can vary between projects, but typically uses previously defined types.

`<scope>` (option): Scope of the commitment, specifying the portion of the project that will affect the image. For example, authentication, database, user interface and many other scopes. Range also cannot be used in some cases.

`<subject>`: Content of the commit, a brief description of the changes made. Should be written in lower case and use clear language and complete descriptions.

```bash
<type>(<scope>): <topic>
```

Example of a standard commit message:

```bash
feat(authentication): Add login function
```

In this example, the commit message indicates that login functionality has been added to the "authentication" scope.
