"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
var core_1 = require('@angular/core');
var SendMail = (function() {
    function SendMail(sendMailSrv) {
    }

    SendMail.prototype.send = function(e) {
        // http.post('/api/sendMail')
        console.info(this, e);
        sendMailSrv.sendMail()
                   .subscribe(function(r) { return console.info(r); }, function(e) { return console.info(e); });
    };
    SendMail = __decorate([
        core_1.Component({
            selector:    'send-mail',
            templateUrl: './sendMail.component.html',
            styleUrls:   ['./sendMail.component.css']
        })
    ], SendMail);
    return SendMail;
}());
exports.SendMail = SendMail;
var MailOpts = (function() {
    function MailOpts() {
    }

    return MailOpts;
}());
exports.MailOpts = MailOpts;
//# sourceMappingURL=sendMail.component.js.map