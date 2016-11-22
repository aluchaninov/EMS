import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import * as io from 'socket.io-client';

@Injectable()
export class SendMailService {
    private socket;
    private url = window.location.origin;//'http://localhost:3000';

    static handleSuccess(observer, data) {
        observer.next(data);
    }

    static handleError(observer, err) {
        err.proposition = 'You can check your Email Quota at https://ctrlq.org/google.apps.script/utilities/quota.html';
        observer.error(err);
    }

    sendMail(data: Object) {
        this.socket = io(this.url);

        return new Observable((observer) => {
            this.socket.on('mails-sent', (data) => {
                SendMailService.handleSuccess(observer, data);
            });

            this.socket.on('mails-sent-error', (err) => {
                SendMailService.handleError(observer, err);
            });

            this.socket.on('error', (err) => {
                SendMailService.handleError(observer, err);
            });

            this.socket.emit('send-mails', data);

            return () => {
                this.socket.disconnect();
            };
        });
    }
}