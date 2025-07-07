import { createStore, State, useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("createStore", () => {
    it("can load a state value into the global store", () => {
        createStore([
            new State("myState", true)
        ]);

        const [getter, _setter] = useState("myState"); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(true);
    });

    it("can load multiple state values into the global store", () => {
        createStore([
            new State("myState", true), 
            new State("yourState", false)
        ]);

        const [getter, _setter] = useState("myState"); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(true);
        const [_getter, __setter] = useState("yourState"); // eslint-disable-line no-unused-vars
        expect(_getter()).toBe(false);
    });

    it("can append a state value to the global store", () => { 
        const [_getter, _setter] = useState("myState", false); // eslint-disable-line no-unused-vars

        createStore([
            new State("yourState", true)
        ]);

        const [getter, __setter] = useState("yourState"); // eslint-disable-line no-unused-vars
        expect(getter()).toBe(true);
    });

    it("can override a state value in the global store", () => { 
        const [getter, _setter] = useState("myState", false); // eslint-disable-line no-unused-vars

        createStore([
            new State("myState", true)
        ]);

        expect(getter()).toBe(true);
    });
});
