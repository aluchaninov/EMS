"use strict";
// Angular 2
// rc2 workaround
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
// Environment Providers
var PROVIDERS = [];
// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
var _decorateModuleRef = function identity(value) { return value; };
if ('production' === ENV) {
    // Production
    platform_browser_1.disableDebugTools();
    core_1.enableProdMode();
    PROVIDERS = PROVIDERS.slice();
}
else {
}
exports.decorateModuleRef = _decorateModuleRef;
exports.ENV_PROVIDERS = PROVIDERS.slice();
//# sourceMappingURL=environment.js.map