/* eslint-disable */

import { component, html } from "haunted-w-microtask";

function ChildTwo(el) {
  return html`
    <h1>I am child 2. I don't have a child router</h1>
  `;
}

customElements.define(
  "child-two",
  component(ChildTwo, HTMLElement, {
    useShadowDOM: false
  })
);
