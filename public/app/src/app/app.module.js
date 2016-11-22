"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
/*
 * Platform and Environment providers/directives/pipes
 */
var environment_1 = require('./environment');
var app_routes_1 = require('./app.routes.ts');
// App is our top level component
var app_component_1 = require('./app.component.ts');
var app_resolver_1 = require('./app.resolver.ts');
var app_service_1 = require('./app.service.ts');
var home_1 = require('./home/index');
var sendMail_component_1 = require('./send-mail/sendMail.component.ts');
// import {AboutComponent} from './about';
// import {NoContentComponent} from './no-content';
// import {XLarge} from './home/x-large';
// Application wide providers
var APP_PROVIDERS = app_resolver_1.APP_RESOLVER_PROVIDERS.concat([
    app_service_1.AppState
]);
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
var AppModule = (function() {
    function AppModule(appRef, appState) {
        this.appRef = appRef;
        this.appState = appState;
    }

    AppModule = __decorate([
        core_1.NgModule({
            imports:      [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot(app_routes_1.ROUTES, {useHash: false})
            ],
            bootstrap:    [app_component_1.AppComponent],
            declarations: [
                app_component_1.AppComponent,
                home_1.HomeComponent,
                sendMail_component_1.SendMail
            ],
            providers:    [
                environment_1.ENV_PROVIDERS,
                APP_PROVIDERS
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map