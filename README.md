![Rewright Logo](https://raw.githubusercontent.com/TristanDamron/rewright/refs/heads/main/brand/rewright-logo.svg)

![Bun](https://img.shields.io/badge/bun-282a36?style=for-the-badge&logo=bun&logoColor=fbf0df)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Test Status](https://github.com/tristandamron/rewright/actions/workflows/test.yml/badge.svg)
![Build Status](https://github.com/tristandamron/rewright/actions/workflows/pkg.yml/badge.svg)
![Lint Status](https://github.com/tristandamron/rewright/actions/workflows/lint.yml/badge.svg)
![Proudly made without AI](https://img.shields.io/badge/Proudly%20made%20without%20generative%20AI-orange)

# Welcome to Rewright!

Rewright is a single-dependency, ultra-lightweight module providing you with a React-like state management system in Playwright. Because web applications are (more often than not) dynamic, your end-to-end tests should be too!

Read our API documentation here: https://tristandamron.github.io/rewright/

## Quick start tutorial

Whether you're starting a new Playwright project, or you're implementing Rewright into an existing project, getting started with Rewright is simple!

Consider a typical Playwright test file:

```ts
import { test, expect } from "playwright/test";

test.describe("My really great test suite", () => {
        test("My test case", async ({ page }) => {
            await page.goto("https://google.com/");
            await expect(page.getByRole("label", { name: "Search" })).toBeVisible();
        });
});
```

This test file uses the default Playwright test fixture which exposes the `page` object, allowing you to control the browser. We can update this file to use Rewright's test fixture instead:

```ts
import { test } from "rewright";
import { expect } from "playwright/test";

test.describe("My really great test suite", () => {
        test("My test case", async ({ page, state }) => {
            await page.goto("https://google.com/");
            await expect(page.getByRole("label", { name: "Search" })).toBeVisible();
        });
});
```

Rewright's test fixture exposes an internal state manager that we can use to keep track of our application's state in our tests. While this example demonstrates how you can access Rewright's state manager through the test fixture, the module also has additional functions for managing state. You can learn more about this topic on our API documentation site: https://tristandamron.github.io/rewright/

## Developer guide

Rewright is written in Typescript using [Bun](https://bun.sh/). The project is licensed under the MIT license and contributions are always welcome! The following guide will teach you how to work with the project on your own machine.

### How to contribute to this project

Please follow this workflow to contribute to this project:
- Clone this repository and setup your development environment.
- Identify an open issue that you want to work on on the Github Repository page.
- Create a local branch off of the origin's main branch.
- Implement a solution which satisfies the issue you picked up.
- Update/add new automated tests, if necessary.
- Update/add documentation, if necessary.
- Ensure all automated tests pass, and that you have thoroughly manually tested your changes.
- Push your branch to Github and submit a PR to the main branch.

After submitting your PR, a project maintainer will review it before it is merged to the main branch. Please remember that this project was proudly written without the use of generative AI tools. Please do not submit PRs which contain AI generated code, the maintainers will not approve them.

### Installing dependencies

After cloning this repository to your machine, `cd` into the project directory and execute the following command:

```bash
bun install
```

### Running automated tests

Rewright has several automated test suites which help to ensure that the module is stable and production ready at each release. These tests will run automatically with each PR you create to this repository via Github Actions. You can run the tests locally on your machine with the following command:

```bash
bun run test
```

### Generating documentation

API documentation should be updated with each new update. You can generate an up-to-date version of the documentation using this command:

```bash
bun run docs
```

### Building Rewright

You can build Rewright and package the module to a .tgz file for testing using the following command:

```bash
bun run pkg
```

