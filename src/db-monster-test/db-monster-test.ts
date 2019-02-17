/* eslint-disable */
import "./db-monster-test.scss"
import { component, useState, useEffect } from "haunted";
import { html, TemplateResult } from "lit-html";

const hub = {cb: function(){}};


function DBMonster() {
    const [dbs, setDbs] = useState(ENV.generateData().toArray());

    useEffect(() => {
        window.perfMonitor.endProfile('view update');
        setTimeout(() => {
            window.perfMonitor.startProfile('view update');
            setDbs(ENV.generateData().toArray());
        }, ENV.timeout);
    })

    return dbs ? html`
    <table class="table table-striped latest-data">
      <tbody>${dbs.map((db, i) => html`
        <tr key="${db.dbname}">${[
          html`<td class="dbname">${db.dbname}</td>`,
          html`
          <td class="query-count">
            <span class="${db.lastSample.countClassName}">
              ${db.lastSample.nbQueries}
            </span>
          </td>`
        ].concat(db.lastSample.topFiveQueries.map((query, j, a) =>
          html`
          <td class="${query.elapsedClassName}">
            <span class="foo">
              ${query.formatElapsed}
            </span>
            <div class="popover left">
              <div class="popover-content">
                ${query.query}
              </div>
              <div class="arrow"></div>
            </div>
          </td>`
          ))
        }</tr>`
      )}</tbody>
    </table>` : html`loading...`
}

customElements.define("db-monster-test", component(DBMonster, HTMLElement, {
  useShadowDOM: false
}));



if (!window.perfMonitor) {
  perfMonitor = {
    endProfile: function () {},
    initProfiler: function () {},
    startFPSMonitor: function () {},
    startMemMonitor: function () {},
    startProfile: function () {}
  };
}
perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
// perfMonitor.initProfiler('data update');
perfMonitor.initProfiler('view update');
