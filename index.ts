import { test as base } from '@playwright/test';

class Store {
    static state: Record<string, any> = {};
}

/**
 * A type alias for a Rewright stateful datatype.
 */
export type State = Record<string, any>;

/**
 * A Playwright test fixture that includes a Rewright stateful object.
 *
 * When implementing Rewright into your Playwright project, you should use this fixture as your base fixture and build off of it.
 *
 * @example
 * ```ts
 * import { test } from "rewright";
 * import { expect } from "playwright/test";
 *
 * test("Search for query", async ({ page, state }) => {
 *      const googlePOM = new GooglePOM(page);
 *      state.searchQuery = "Cute cat memes";
 *      await page.goto("https://google.com");
 *      await googlePOM.searchFor(state.searchQuery);
 *      await expect(googlePOM.searchBox).toContainText(state.searchQuery);
 * });
 * ```
 */
export const test = base.extend<{ state: State }>({
  state: async ({}, use) => { // eslint-disable-line no-empty-pattern
    const state = Store.state;
    await use(state);
  },
});

/**
 * A function for managing state within a class or function.
 * The managed state is globally available.
 * @param {string} name - the name of the state to be managed.
 * @param {any} defaultValue - optional; the default value of the state.
 * @returns A getter and setter function for the managed state.
 *
 * @example
 * ```ts
 * function foo() {
 *      const [getMyState, setMyState] = useState("myState", false);
 * }
 * ```
 */
export function useState(name: string, defaultValue?: any): [Function, Function] {
    if (defaultValue)
        Store.state[name] = defaultValue;

    return [() => { return Store.state[name] }, (newValue: any) => {
        Store.state[name] = newValue;
    }];
}

/**
 * A function that triggers a callback event if a state dependency changes.
 * @param {Function} callback - the callback event to trigger.
 * @param {string[]} dependencies - the names of the state values to watch.
 *
 * @example
 * ```ts
 * import { useState, useEffect } from "rewright";
 *
 * class GooglePOM {
 *      protected setSearchQuery;
 *      protected getSearchQuery;
 *
 *      constructor(page: Page) {
 *          [this.getSearchQuery, this.setSearchQuery] = useState("searchQuery", "");
 *          useEffect(() => {
 *              console.log("The search query has changed!");
 *          }, ["searchQuery"]);
 *      }
 * }
 * ```
 */
export function useEffect(callback: Function, dependencies: string[]): any {
    if (dependencies.length === 0)
        callback();

    const stateDependencies = dependencies.map((name) => {
        return {name, "value": Store.state[name]};
    });

    setInterval((prevDependencies) => {
        prevDependencies.forEach((state) => {
            if (state.value !== Store.state[state.name]) {
                callback();
                state.value = Store.state[state.name];
            }
        })
    }, 0.0000001, stateDependencies);
}

