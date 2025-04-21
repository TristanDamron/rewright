import { createStore, useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("createStore", () => {
    it("can load a state value into the global store", () => {
        createStore([
            {
                name: "myState",
                value: true,
            }
        ]);

        const [getter, _setter] = useState("myState");
        expect(getter()).toBe(true);
    });

    it("can load multiple state values into the global store", () => {
        createStore([
            {
                name: "myState",
                value: true,
            },
            {
                name: "yourState",
                value: false,
            }
        ]);

        const [getter, _setter] = useState("myState");
        expect(getter()).toBe(true);
        const [_getter, __setter] = useState("yourState");
        expect(_getter()).toBe(false);
    });
});

