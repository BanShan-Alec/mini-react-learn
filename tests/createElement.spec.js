import { describe, it, expect } from "vitest";
import React from "../core/React.js";

describe("createElement", () => {
  it("should create a text element", () => {
    const textEl = React.createTextElement("Hello World！！！");
    expect(textEl).toEqual({
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: "Hello World！！！",
        children: [],
      },
    });
  });
  it("should create a element", () => {
    const textEl = React.createTextElement("Hello World！！！");
    const el = React.createElement("div", { id: "app" }, textEl);

    expect(el).toEqual({
        type: 'div',
        props: {
            id: "app",
            children: [
                {
                    type: 'TEXT_ELEMENT',
                    props: {
                        nodeValue: 'Hello World！！！',
                        children: []
                    }
                }
            ]
        }
    });

//     expect(el).toMatchInlineSnapshot(`
//     "props": {
//           "children": [
//             {
//               "props": {
//                 "children": [],
//                 "nodeValue": "Hello World！！！",
//               },
//               "type": "TEXT_ELEMENT",
//             },
//           ],
//           "id": "app",
//         },
//         "type": "div"
//  `);
  });
});
