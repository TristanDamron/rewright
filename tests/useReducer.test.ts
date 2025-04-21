import { useReducer, useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("useReducer", () => {
    it("can apply unique logic when updating a state value", () => {
        const [getter, inc] = useReducer("test", () => {
            return getter() + 1;
        }, 2);

        inc();
        expect(getter()).toBe(3);
    });

    it("can apply unique logic when updating a state value with a parameter", () => {
        const [getter, acc] = useReducer("test", (action: { incrementBy?: number, decrementBy?: number }) => {
            if (action.incrementBy)
                return getter() + action.incrementBy;

            if (action.decrementBy)
                return getter() - action.decrementBy;

            return getter()
        }, 2);

        acc({ incrementBy: 1 });
        expect(getter()).toBe(3);
        acc({ decrementBy: 2 });
        expect(getter()).toBe(1);
    });

    it("can apply unique logic to a state created using useState", () => {
        const [getter, _setter] = useState("test", "Hello"); // eslint-disable-line no-unused-vars
        const [_getter, setter] = useReducer("test", () => {
            return `${_getter()}, Rewright!`;
        });

        setter();
        expect(getter()).toBe("Hello, Rewright!");
    });
});
