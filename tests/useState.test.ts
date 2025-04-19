import { useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("useState", () => {
    it("can initialize a state value with a default value", () => {
        const [getter, _setter] = useState("test", true);
        expect(getter()).toBe(true);
    });

    it("can set a state value", () => {
        const [getter, setter] = useState("test", true);
        setter(false);
        expect(getter()).toBe(false);
    });

    it("can capture an existing state value", () => {
        const [_getter, _setter] = useState("test", true);
        const [getter, __setter] = useState("test");
        expect(getter()).toBe(true);
    });

    it("cannot override an existing state value", () => {
        const [_getter, _setter] = useState("test", true);
        const [getter, __setter] = useState("test", false);
        expect(getter()).toBe(true);
    });
});
