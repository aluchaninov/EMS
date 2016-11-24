import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {ENV_PROVIDERS} from './environment';

import {HomeComponent} from './home';
import {AppState} from './app.service';
import {FileSelectDirective} from 'ng2-file-upload/ng2-file-upload';
import {SendMailService} from './services/sendMail.srv'
import {SendMail} from './send-mail/sendMail.component';
import {SpinnerComponent} from './spinner/spinner.component';

// Application wide providers
const APP_PROVIDERS = [
    AppState
];

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule
    ],
    bootstrap:    [HomeComponent],
    declarations: [
        HomeComponent,
        SendMail,
        FileSelectDirective,
        SpinnerComponent
    ],
    providers:    [
        ENV_PROVIDERS,
        APP_PROVIDERS,
        SendMailService
    ]
})
export class AppModule {
    constructor() {}
}