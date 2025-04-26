import { useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("useState", () => {
    it("can initialize a state value with a default value", () => {
        const [getter, _setter] = useState("test", true); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(true);
    });

    it("can set a state value", () => {
        const [getter, setter] = useState("test", true);
        setter(false);
        expect(getter()).toBe(false);
    });

    it("can capture an existing state value", () => {
        const [_getter, _setter] = useState("test", true); // eslint-disable-line no-unused-vars
        const [getter, __setter] = useState("test"); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(true);
    });

    it("can override an existing state value", () => {
        const [_getter, _setter] = useState("test", true); // eslint-disable-line no-unused-vars
        const [getter, __setter] = useState("test", false); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(false);
    });
});
