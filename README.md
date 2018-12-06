# Plugin

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

The project requires NodeJS to be installed:
1. Install webpack globally `npm -g webpack`.
2. Move to project folder and run `npm i`.
3. Run `sh build-dev.sh` or `sh build-prod.sh` to build the project. The build artifacts will be stored in the `dist/` directory.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `sh build-dev.sh` or `sh build-prod.sh` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Integration

To integrate EOS Plugin into your project:

1. Install `eosjs` library via `npm` and retrieve `Eos` instance from it.

2. Get plugin instance by `eosPluginLoaded` event, like:
  ```js
  document.addEventListener('eosPluginLoaded', () => {})
  ```

3. Request and cache identity like: 
  ```js
  window.eosPlugin.requestIdentity({ host: 'jungle.eos.smartz.io', port: 443 })
  ```
  This call opens the prompt window where user can select predifined network account. Returns an identity with `publicKey` and `accounts` information. The plugin caches user selection for future operations.

4. Get cached or request identity like:
  ```js
  window.eosPlugin.getIdentity({ host: 'jungle.eos.smartz.io', port: 443 })
  ```

5. Use EOS instance like:
  ```js
  window.eosPlugin.eos({ host: 'jungle.eos.smartz.io', port: 443 }, Eos, eosInstanceOptions)
  ```

Usage example: 

```js

import * as Eos from 'eosjs';

const network = {
  host: 'jungle.eos.smartz.io',
  port: 443
};

document.addEventListener('eosPluginLoaded', () => {
  const identity = window.eosPlugin.getIdentity(network);

  if (identity) {
    const { publicKey, accounts } = identity;

    const eos = window.eosPlugin.eos(network, Eos);

    eos.transaction(tr => {
      // transaction code here
    });
  }
});

```



