/* eslint-disable */

import { component } from "haunted";
import { html } from "lit-html";

const MAX_DEPTH = 50;

function RecursiveChild(el) {
  const depth = Number(el.depth);
  const { first, last } = el;

  return html`
    RAF: ${window.rafNum}
    <div class="container">
      <label for="first">First</label>
      <input value="${first}" type="text" name="first" />

      <label for="last">Last</label>
      <input value="${last}" type="text" name="last" />
    </div>

    <style>
      .container {
        border: none;
        display: grid;
        grid-template-columns: 20% 80%;
      }

      input {
        border: 1px solid #e5e5e5;
        padding: 6px 10px;
        margin-bottom: 1em;
      }
    </style>

    ${
      depth > MAX_DEPTH
        ? html`
            Total Time to Render: ${(Date.now() - window.renderStart) / 1000}
            seconds
          `
        : html`
            <recursive-child
              id="recursive-child-${depth + 1}"
              depth="${depth + 1}"
              first="${first}"
              last="${last}"
            ></recursive-child>
          `
    }
  `;
}

RecursiveChild.observedAttributes = ["depth", "first", "last"];

customElements.define("recursive-child", component(RecursiveChild, HTMLElement, {
  useShadowDOM: false
}));
