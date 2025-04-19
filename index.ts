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

/**
 * A function that triggers a callback event if a state dependency changes.
 * @param {Function} callback - the callback event to trigger.
 * @param {Array<string>} dependencies - the names of the state values to watch.
 */
export function useEffect(callback: Function, dependencies: Array<string>): any {
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

