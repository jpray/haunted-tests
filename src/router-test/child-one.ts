/* eslint-disable */

import { component, html } from "haunted-w-microtask";

import { useRouter } from './use-router';

const routes = {
    "/child-route-A": html`<h2>I am child 1 route A</h2>`,
    "/child-route-B": html`<h2>I am child 1 route B</h2>`
};

function ChildOne({baseRoute}) {
  const route = useRouter({
    id: "childRouter",
    routes: routes,
    defaultRoute: "/child-route-A",
    baseRoute: baseRoute
  });

  return !route ? html`` : html`
    <h1>I am child 1.  I have a child router</h1>

    <a href="${baseRoute}/child-route-A">Go to child route A</a>
    <a href="${baseRoute}/child-route-B">Go to child route B</a>

    ${routes[route]}
  `;
}

ChildOne.observedAttributes = ['base-route'];

customElements.define(
  "child-one",
  component(ChildOne, HTMLElement, {
    useShadowDOM: false
  })
);
