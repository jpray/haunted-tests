import { component } from "haunted";
import { html, TemplateResult } from "lit-html";
import "./error-indicator.scss";

/**
 * Example Usage:
 * ```
 * <error-indicator></error-indicator>
 * ```
 */
const Error = (): TemplateResult => {
  return html`
    <div>Oops, an error has occurred. Sorry for the inconvenience. Please try again later.</div>
  `;
};

customElements.define("error-indicator", component(Error));
