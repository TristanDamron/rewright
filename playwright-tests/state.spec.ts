import { test } from "../index.ts";
import { expect } from "@playwright/test";

test.describe("state fixture", () => {
    test("can set state value", ({ state }) => {
        state.test = { name: "test", value: true };
        expect(state.test.value).toBe(true);
    });

    test("can update state value", ({ state }) => {
        state.test = { name: "test", value: true };
        state.test = { name: "test", value: false };
        expect(state.test.value).toBe(false);
    });
});

