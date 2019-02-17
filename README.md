# haunted-tests

## Available Tests

[DBMonster Test](https://pages.github.com/jpray/haunted-tests/dist/db-monster-test.html)

[Nested Children Test](https://pages.github.com/jpray/haunted-tests/dist/nested-children-test.html)


This project shows some tests and patterns on how to implement an app with web components and the hooks pattern (from React) using the following libraries:
- [typescript](https://www.typescriptlang.org/docs/home.html)
- [parcel](https://parceljs.org/getting_started.html)
- [lit-html](https://lit-html.polymer-project.org/guide/template-reference)
- [haunted](https://github.com/matthewp/haunted)

## Getting Started (install dependencies and run in dev mode)

- `npm install`
- `npm run dev`

## Running Script and Style Linting

- `npm run lint`

## Running Builds

- `npm run build` (Builds web and mobile)

### About web builds

Web assets are built to the "dist" folder.  From there they can be moved to a server.

### TODOs

#### Code splitting
Code splitting works when tsconfig.json has `"module": "esnext"` in the compilerOptions, but that setting is creating a weird issue when trying to view some pages, so for now we are not using it. 
