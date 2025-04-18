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
 */
export const test = base.extend<{ state: State }>({
  state: async ({}, use) => {
    const state = Store.state;
    await use(state);
  },
});

/**
 * A function for managing state within a class or function.
 * @param {string} name - the name of the state to be managed.
 * @param {any} defaultValue - the default value of the state.
 * @returns A getter and setter function for the managed state.
 */
export function useState(name: string, defaultValue: any): [Function, Function] {
    Store.state[name] = defaultValue;
    return [() => { return Store.state[name] }, (newValue: any) => {
        Store.state[name] = newValue;
    }];
}

