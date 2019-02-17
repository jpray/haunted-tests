/* eslint-disable */

import { component, useReducer, html } from "haunted-w-microtask";
import "./recursive-child-micro.ts";
import "./nested-children-test.scss";

let logRafs = true;
setTimeout(() => {
  logRafs = false;
}, 1000);

window.rafNum = 0;
function countAnimationFrames() {
  window.requestAnimationFrame(() => {
    window.rafNum++;
    if (logRafs) {
      console.log("RAF: " + window.rafNum);
    }
    countAnimationFrames();
  });
}
countAnimationFrames();

const reducer = (state, action) => {
  switch (action.type) {
    case "first":
      return {
        ...state,
        first: action.data
      };
    case "last":
      return {
        ...state,
        last: action.data
      };
  }
};

function NestedChildrenTest(el) {
  window.renderStart = Date.now();

  const [{ first, last }, dispatch] = useReducer(reducer, {
    first: "happy",
    last: "halloween"
  });

  const onInput = ev => {
    const target = ev.path[0]; //smell
    dispatch({
      type: target.name,
      data: target.value
    });
  };

  return html`
    <h1>Scroll to bottom and update a field to see the time it takes to render</h1>

    🎃RAF: ${window.rafNum}

    <h3>${first} ${last}</h3>

    <recursive-child
      id="recursive-child-0"
      @input="${onInput}"
      depth="0"
      first="${first}"
      last="${last}"
    >
    </recursive-child>
  `;
}

customElements.define(
  "nested-children-test-micro",
  component(NestedChildrenTest, HTMLElement, {
    useShadowDOM: false
  })
);
