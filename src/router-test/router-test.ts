/* eslint-disable */

import { component, html } from "haunted-w-microtask";
import "./router-test.scss";
import { useRouter } from './use-router';

import "./child-one";
import "./child-two"

const routes = {
    "#/route1": html`<child-one base-route="#/route1"></child-one>`,
    "#/route2": html`<child-two base-route="#/route2"></child-two>`
};

function RouterTest(el) {

  const route = useRouter({
    id: "parentRouter",
    routes: routes,
    defaultRoute: "#/route1",
    baseRoute: ""
  });

  return !route ? html`` : html`
    <h1>Element with router</h1>

    <a href="#/route1">Go To Child 1</a>
    <a href="#/route2">Go To Child 2</a>

    <main>
      ${routes[route]}
    </main>
  `;
}

customElements.define(
  "router-test",
  component(RouterTest, HTMLElement, {
    useShadowDOM: false
  })
);
