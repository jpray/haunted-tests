import { component } from "haunted";
import { html, TemplateResult } from "lit-html";
import "./loading-indicator.scss";

/**
 * Example Usage:
 * ```
 * <loading-indicator></loading-indicator>
 * ```
 */
const Loading = (): TemplateResult => {
  return html`
    <div>Loading...</div>
  `;
};

customElements.define("loading-indicator", component(Loading));
