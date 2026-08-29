# Task Planning & Decomposition

Read and deeply analyze the file:

`needs.md`

Your job is **NOT to implement any code**.

Your job is to understand the requirements completely and convert them into a highly professional, structured, executable task plan.

## 1. Analyze the Original Task

First, carefully read `tasks_6.md` from beginning to end.

Understand:

* The main objective
* Functional requirements
* UI/UX requirements
* Backend requirements
* Frontend requirements
* Database requirements
* API requirements
* Business logic
* Dependencies
* Existing functionality that must not be broken
* Edge cases
* Validation requirements
* Error handling
* Responsive/mobile requirements
* Arabic/English requirements if mentioned
* Any implicit requirements necessary to complete the feature correctly

Do NOT blindly copy the original file.

You must understand the actual work that needs to be done.

---

# 2. Create a Dedicated Task Folder

Create a new folder:

`tasks_6/`

Inside it, create multiple `.md` files.

Each `.md` file should represent **one logical major task**.

For example:

```text
tasks_6/
├── 01-analysis.md
├── 02-database.md
├── 03-backend.md
├── 04-frontend.md
├── 05-ui-ux.md
├── 06-validation.md
├── 07-integration.md
└── 08-testing.md
```

The exact files and number of files must be determined by the actual requirements in `tasks_6.md`.

Do NOT create unnecessary files just to increase the number of tasks.

---

# 3. Decompose Every Major Task

Every major task must be broken down into **small, concrete subtasks**.

Bad:

```text
- Implement customer management
```

Good:

```text
- Create customer model
- Add customer validation
- Add customer creation endpoint
- Add customer update endpoint
- Add customer deletion endpoint
- Add customer search
- Add customer filtering
- Add customer UI
- Add loading state
- Add empty state
- Add error handling
- Test customer creation
- Test customer update
```

Each subtask must be small enough that a coding agent can implement it without needing to reinterpret the original requirements.

---

# 4. Make Tasks Executable

Every subtask must clearly explain:

### What needs to be done

### Why it is needed

### Where it should be implemented

### What the expected result is

### Dependencies

### Acceptance criteria

Example:

```md
## Subtask 03 — Customer Search

### Objective
Implement searching customers by name, phone number, and relevant identifiers.

### Implementation
- Add search input to the customers page.
- Debounce search requests.
- Connect search input to the customers API.
- Support partial matching.
- Preserve existing filters.

### Dependencies
- Customer API
- Customer database model

### Acceptance Criteria
- Searching by customer name returns matching customers.
- Searching by phone returns matching customers.
- Empty search restores the full customer list.
- Search works correctly on mobile.
- No existing customer functionality is broken.
```

---

# 5. Identify Dependencies

Determine the correct implementation order.

If Task B depends on Task A, explicitly mention it.

Example:

```md
### Dependencies
- Requires `02-database.md`
- Requires `03-backend.md`
```

Also create a clear dependency order at the beginning of the task system.

---

# 6. Separate Frontend / Backend / Database / UI When Necessary

Do not mix unrelated responsibilities inside one task.

If a requirement involves:

```text
Database
→ API
→ Frontend
→ UI
→ Validation
→ Testing
```

break it into appropriate tasks.

However, do NOT artificially separate things that are tightly coupled.

The goal is **logical separation**, not maximum fragmentation.

---

# 7. Preserve Existing Functionality

Before creating the tasks, identify functionality that already exists and must continue working.

Add explicit notes whenever a new change could affect existing functionality.

Example:

```md
### Regression Requirements

The implementation must NOT break:

- Existing customer creation
- Existing payment records
- Existing search
- Existing authentication
- Existing mobile layout
```

---

# 8. Include Edge Cases

For every important feature, think about edge cases.

Examples:

* Empty values
* Duplicate records
* Invalid data
* Very long text
* Large numbers
* Missing data
* Network errors
* API errors
* Permission errors
* Mobile screens
* RTL/LTR
* Existing records
* Conflicting data
* Loading states
* Empty states

Do not ignore edge cases simply because they were not explicitly written in `tasks_6.md`.

Only add reasonable edge cases that are logically required by the feature.

---

# 9. Include Acceptance Criteria

Every major task must have clear acceptance criteria.

Example:

```md
## Acceptance Criteria

- [ ] Feature works correctly.
- [ ] Existing functionality remains intact.
- [ ] Validation works.
- [ ] Error states are handled.
- [ ] Loading states are handled.
- [ ] Mobile layout works.
- [ ] Arabic RTL works if applicable.
- [ ] English LTR works if applicable.
```

Acceptance criteria must be specific to the task.

Do NOT use generic criteria everywhere.

---

# 10. Track Task Status

Every `.md` file must start with:

```md
# Task: <Task Name>

Status: pending
Priority: high
```

Each subtask must also be represented using a checkbox:

```md
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3
```

Do NOT mark anything as `done`.

Everything must start as `pending`.

---

# 11. Avoid Ambiguous Tasks

Never create tasks such as:

```text
- Improve UI
- Fix backend
- Make it responsive
- Complete feature
- Handle errors
```

These are too vague.

Instead specify exactly what must be changed.

---

# 12. Think Like a Senior Software Architect

Before creating the files, reason about:

* Architecture
* Dependencies
* Data flow
* Existing code
* Potential regressions
* Implementation order
* API contracts
* Database changes
* UI states
* Error handling
* Testing
* Security
* Performance
* Maintainability

The resulting task structure should be good enough that another coding agent can execute it **without having to go back and reinterpret `tasks_6.md`**.

---

# 13. Final Structure

After finishing, the result should look similar to:

```text
tasks_6/
│
├── 00-overview.md
├── 01-database.md
├── 02-backend.md
├── 03-frontend.md
├── 04-ui-ux.md
├── 05-validation.md
├── 06-integration.md
└── 07-testing.md
```

Again, this is only an example.

Choose the actual structure based on the contents of `tasks_6.md`.

---

# 14. Overview File

Create:

`tasks_6/00-overview.md`

It must contain:

* Original objective
* Complete feature summary
* Task list
* Implementation order
* Dependencies between tasks
* Important architectural notes
* Potential risks
* Regression risks
* Definition of Done

Example:

```md
# Task 6 — Implementation Plan

## Objective

...

## Task Order

1. Database
2. Backend
3. Frontend
4. UI/UX
5. Integration
6. Testing

## Dependencies

...

## Risks

...

## Definition of Done

- [ ] All requirements implemented
- [ ] All subtasks completed
- [ ] Existing functionality verified
- [ ] Errors handled
- [ ] Responsive behavior verified
- [ ] Tests completed
```

---

# 15. Important Rules

### DO

* Read the entire `tasks_6.md`
* Understand before decomposing
* Create a dedicated `tasks_6/` folder
* Create professional `.md` task files
* Break large tasks into small executable subtasks
* Include dependencies
* Include acceptance criteria
* Include edge cases
* Include regression considerations
* Include testing
* Maintain logical implementation order
* Use checkboxes for tracking
* Keep tasks implementation-ready

### DO NOT

* Do not implement code
* Do not modify application source code
* Do not skip requirements
* Do not blindly copy `tasks_6.md`
* Do not create vague tasks
* Do not create unnecessarily tiny tasks
* Do not mark tasks as completed
* Do not assume missing requirements without clearly identifying them
* Do not delete the original `tasks_6.md`

---

# Final Requirement

When finished, verify that:

1. Every requirement from `tasks_6.md` is represented.
2. Every major task has been decomposed into smaller subtasks.
3. Dependencies are clear.
4. Acceptance criteria are clear.
5. Tasks are ordered logically.
6. No implementation code was written.
7. The resulting `tasks_6/` folder is ready to be given to a coding agent.

The goal is to transform:

`tasks_6.md`

into a **professional execution plan made of interconnected, trackable `.md` task files**, with enough detail that a coding agent can execute the plan step-by-step and produce a high-quality result.
