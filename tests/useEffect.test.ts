import { useEffect, useState } from "../index";
import { describe, it, expect } from "bun:test";

describe("useEffect", () => {
    it("triggers a callback funtion when a state value changes", async () => { 
        let triggered = false 
        const [_getter, setter] = useState("test", false); // eslint-disable-line no-unused-vars
        
        useEffect(() => {
            triggered = true;
        }, ["test"]); 
 
        setter(true);
        expect(triggered).toBe(true);
    });

    it("instantly triggers callback if there are no dependencies", async () => {
        let triggered = false;

        useEffect(() => {
            triggered = true;
        }, []);
        
        expect(triggered).toBe(true);
    });

    it("triggers a callback function with multiple dependency updates", async () => {
        const [_getter, _setter] = useState("test", false); // eslint-disable-line no-unused-vars
        const [__getter, setter] = useState("test2", false); // eslint-disable-line no-unused-vars

        useEffect(() => {
            triggered = true;
        }, ["test", "test2"]);

        let triggered = false;
        setter(true);
        expect(triggered).toBe(true);
    });
});
