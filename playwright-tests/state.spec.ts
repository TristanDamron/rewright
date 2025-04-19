import { test } from "../index.ts";
import { expect } from "@playwright/test";

test.describe("state fixture", () => {
    test("can set state value", ({ state }) => {
        state.test = true;
        expect(state.test).toBe(true);
    });

    test("can update state value", ({ state }) => {
        state.test = true;
        state.test = false;
        expect(state.test).toBe(false);
    });
});

