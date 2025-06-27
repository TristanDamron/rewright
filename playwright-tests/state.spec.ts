// @ts-nocheck

import { test, state, type StateSetter, type StateGetter } from "../index.ts";
import { expect, type Page } from "@playwright/test";
import { useState } from "../index.ts";

@state("test", true, (page: Page) => {
    return {
        "truthy": true,
        "locator": page.locator("test"),
        "testTruthy": () => { return "Hello world!" }
    }
})
class SomePOM {
    readonly getTest: StateGetter;
    readonly setTest: StateSetter;
    readonly truthy: boolean;

    constructor(protected page: Page) {
        this.truthy = false;
        [this.getTest, this.setTest] = useState("test");
    }

    public getTruthy(): boolean {
        return this.truthy;
    }
}

test.describe("state fixtures in a playwright test", () => {
    test("can set state value", ({ state }) => {
        state.test = { name: "test", value: true };
        expect(state.test.value).toBe(true);
    });

    test("can update state value", ({ state }) => {
        state.test = { name: "test", value: true };
        state.test.value = false;
        expect(state.test.value).toBe(false);
    });

    test("can get state value from fixture from inside of a POM", ({ state, page }) => {
        state.test = { name: "test", value: true };
        const somePom = new SomePOM(page);
        expect(somePom.getTest()).toBe(true);
    });

    test("can override a POM if a state value is set", ({ state, page }) => { 
        state.test = { name: "test", value: true };
        const somePom = new SomePOM(page);
        expect(somePom.getTruthy()).toBe(true);
        expect(somePom.testTruthy()).toBe("Hello world!"); 
        expect(somePom.locator).not.toBe(undefined);
    });

    test("obfuscates overrides if state is not an expected value", ({ state, page }) => { 
        state.test = { name: "test", value: false };
        const somePom = new SomePOM(page);
        expect(somePom.getTruthy()).toBe(false);
        expect(somePom.testTruthy).toBe(undefined);
    });
});
