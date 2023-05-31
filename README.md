Get started:

```
yarn install
yarn dev
```

Build for production:

```
yarn build
```

Settings are in `src/lib/settings.js`. Many can be set with environment variables.
For example, to use libris-dev/id-dev instead of local API endpoints:

```
export VITE_VUE_APP_API_PATH="https://libris-dev.kb.se"
export VITE_VUE_APP_ID_PATH="https://id-dev.kb.se"
yarn dev  # or yarn build
```

A few settings (`idPath`, `apiPath`) can be set at runtime in production (but currently not development!) mode; see
`public/runtimeConfig.js`. So you can `yarn build`, write a `runtimeConfig.js` to the `dist/` directory, and the app
will use settings from that file.

Note that Vite only exposes environment variables prefixed with `VITE_`.


---

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Pre-push hook
Since `yarn dev` does not catch all errors, install the following git hook to make sure the project is buildable when pushing.
```
cat > .git/hooks/pre-push << EOF
#!/bin/sh
yarn build
EOF

chmod a+x .git/hooks/pre-push
```



