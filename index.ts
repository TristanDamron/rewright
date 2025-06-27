import { test as base } from '@playwright/test';

/**
 * A type for a reducer callback function.
 */
export type ReducerCallback = (action?: any) => any; // eslint-disable-line no-unused-vars

/**
 * A type for a stateful getter function.
 */
export type StateGetter = () => any;

/**
 * A type for a stateful setter function.
 */
export type StateSetter = (newValue: any) => void; // eslint-disable-line no-unused-vars

/**
 * A type for an effect callback function.
 */
export type EffectCallback = () => void;

/**
 * A type for a class override callback function.
 */
export type ClassOverride = (...args: any[]) => Record<string, any>

/**
 * An interface for a Rewright stateful object.
 */
export interface State { name: string, value: any };

class GlobalStore {
    static state: Record<string, State> = {};
}

/**
 * A Playwright test fixture that includes a Rewright stateful object.
 *
 * When implementing Rewright into your Playwright project, you should use this fixture as your base fixture and build off of it.
 *
 * @example
 * ```ts
 * test("Search for query", async ({ page, state }) => {
 *      const googlePOM = new GooglePOM(page);
 *      state.searchQuery = {name: "searchQuery", value: "Cute cat memes" };
 *      await page.goto("https://google.com");
 *      await googlePOM.searchFor(state.searchQuery.value);
 *      await expect(googlePOM.searchBox).toContainText(state.searchQuery.value);
 * });
 * ```
 */
export const test = base.extend<{ state: Record<string, State> }>({
  state: async ({}, use) => { // eslint-disable-line no-empty-pattern
    await use(GlobalStore.state);
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
export function useState(name: string, defaultValue?: any): [StateGetter, StateSetter] {
    if (defaultValue !== undefined)
        GlobalStore.state[name] = { name, value: defaultValue };

    return [() => { return GlobalStore.state[name]!.value }, (newValue: any) => {
        GlobalStore.state[name] = { name, value: newValue };
    }];
}

/**
 * A function that triggers a callback event if a state dependency changes.
 * @param {EffectCallback} callback - the callback event to trigger.
 * @param {string[]} dependencies - the names of the state values to watch.
 *
 * @example
 * ```ts
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
export function useEffect(callback: EffectCallback, dependencies: string[]): void {
    if (dependencies.length === 0)
        callback();

    const stateDependencies = dependencies.map((name) => {
        return {name, "value": GlobalStore.state[name]!.value};
    });

    setInterval((prevDependencies) => {
        prevDependencies.forEach((state) => {
            if (state.value !== GlobalStore.state[state.name]!.value) {
                callback();
                state.value = GlobalStore.state[state.name]!.value;
            }
        })
    }, 0.0000001, stateDependencies);
}

/**
 * A function for managing state, similar to useState.
 * This function takes a reducer function, applying unique logic when setting the value of the managed state.
 * The callback function triggered by this function processes an optional `action` parameter, allowing you to
 * pass in values which influnce your reducer's update logic.
 * The managed state is globally available.
 * @param {string} name - the name of the state to be managed.
 * @param {ReducerCallback} callback - the callback function to trigger when setting the value of the state.
 * @param {any} defaultValue - optional; the default value of the state.
 * @returns A getter and setter function for the managed state.
 *
 * @example
 * ```ts
 * function foo() {
 *      const [getCounter, incCounter] = useReducer("counter", (incrementBy: number) => {
 *          return getCounter() + incrementBy;
 *      }, 2);
 *
 *      incCounter(1); // Increments 'counter' by 1, counter = 3
 * }
 * ```
 */
export function useReducer(name: string, callback: ReducerCallback, defaultValue?: any): [StateGetter, ReducerCallback] {
    if (defaultValue)
        GlobalStore.state[name] = { name, value: defaultValue };

    return [() => { return GlobalStore.state[name]!.value }, (action: any) => {
        GlobalStore.state[name] = {
            name,
            value: callback(action),
        };
    }];
}

/**
 * A function for creating a state store.
 * State stores are appended to Rewright's global state store. These objects are helpful for defining
 * multiple stateful objects in Rewright that are accessible across multiple classes.
 *
 * @param {State[]} definition - the stateful objects to append to the global state store.
 *
 * @example
 * ```ts
 * createStore([
 *     {
 *         name: "foo",
 *         value: true,
 *     },
 *     {
 *         name: "bar",
 *         value: false,
 *     }
 *]);
 * ```
 */
export function createStore(
    definition: State[]
) {
    for (const state of definition) {
        useState(state.name, state.value);
    }
}


/**
 * A class decorator for changing a class instance based on a state value.
 * This decorator can be useful for applications with lots of feature flags. Using the `@state` decorator allows you
 * to define POMs whose definitions react to changed based on whether a flag is on or off.
 *
 * @param {string} name - the name of the stateful object to check.
 * @param {any} value - the value of the stateful object to check.
 * @param {ClassOverride} classOverrides - the properties and methods you want to override into this class if the stateful object check passes.
 *
 * @example
 * ```ts
 * @state("ff-NewHomePg", true, (page: Page) => {
 *      return {
 *          loginButton: page.locator("#new-login-btn")
 *      } 
 * })
 * class HomePage {
 *      readonly loginButton: Locator;
 *      constructor(page: Page) {
 *          this.loginButton = page.locator("#old-login-btn");
 *      } 
 * }
 * ```
 */
export function state(name: string, value: any, classOverrides: ClassOverride) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                if (GlobalStore.state[name]?.value === value) {
                    const overrides = classOverrides(...args);
                    for (const override in overrides) {
                        (this as any)[override] = overrides[override];
                    }
                }
            }
        };
    };
}
