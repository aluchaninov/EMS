// Angular 2
// rc2 workaround
import {disableDebugTools} from '@angular/platform-browser';
import {enableProdMode} from '@angular/core';
// Environment Providers
let PROVIDERS: any[] = [
    // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let _decorateModuleRef = function identity<T>(value: T): T { return value; };

if ('production' === ENV) {
    // Production
    disableDebugTools();
    enableProdMode();

    PROVIDERS = [
        ...PROVIDERS,
        // custom providers in production
    ];
} else {}

export const decorateModuleRef = _decorateModuleRef;

export const ENV_PROVIDERS = [
    ...PROVIDERS
];
