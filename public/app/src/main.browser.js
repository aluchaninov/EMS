"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var environment_1 = require('./app/environment');
// import {bootloader} from '@angularclass/hmr';
var app_1 = require('./app/index');
function main() {
    return platform_browser_dynamic_1.platformBrowserDynamic()
                                     .bootstrapModule(app_1.AppModule)
                                     .then(environment_1.decorateModuleRef)
                                     .catch(function(err) { return console.error(err); });
}
exports.main = main;
// needed for hmr
// in prod this is replace for document ready
// bootloader(main);
window.addEventListener('DOMContentLoaded', function() {
    main();
});
//# sourceMappingURL=main.browser.js.map