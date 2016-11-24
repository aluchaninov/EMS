import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/observable';
import * as io from 'socket.io-client';

import {Receiver} from '../schemas/receiver';

@Injectable()
export class SendMailService {
    private socket;
    private url = window.location.origin;//'http://localhost:3000';

    static handleSuccess(observer, data) {
        observer.next(data);
    }

    static handleError(observer, err) {
        err.proposition = 'You can check your Email Quota at https://ctrlq.org/google.apps.script/utilities/quota.html';
        observer.next(err);
    }

    sendMail(data: Object): Observable<Receiver> {
        this.socket = io(this.url);

        return new Observable((observer) => {
            this.socket.on('mails-sent', (data) => {
                SendMailService.handleSuccess(observer, data);
            });

            this.socket.on('mails-sent-error', (err) => {
                SendMailService.handleError(observer, err);
            });

            this.socket.on('error', (err) => {
                // SendMailService.handleError(observer, err);
                observer.error(err);
            });

            this.socket.emit('send-mails', data);

            return () => {
                this.socket.disconnect();
            };
        });
    }

    verifyMails(mails: string|Array<string>, queueLimit: number = 100) {
        let listOfBadEmails: Receiver[] = [];
        let receiversList: Receiver[] = [];
        let receiversMails: string = '';

        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
            data = this.processEmailsList(mails);

        data.forEach((val => {
            if (!pattern.test(val.email)) {
                listOfBadEmails.push(val);
            } else {
                receiversList.push(val);

                receiversMails += receiversList.length > 1 ? ', ' + val.email : val.email;
            }
        }));

        let sortedEmailsList = this.buildQueue(receiversList, queueLimit);

        return {
            listOfBadEmails: listOfBadEmails,
            receiversList:   receiversList,
            willSendTo:      sortedEmailsList.willSendTo,
            willNotSendTo:   sortedEmailsList.willNotSendTo,
            receiversMails:  sortedEmailsList.willSendTo.map((email) => email.email).join(', '),
        }
    }

    buildQueue(list: Receiver[], limit: number) {
        return {
            willSendTo:    list.slice(0, limit),
            willNotSendTo: list.slice(limit, list.length)
        }
    }

    processEmailsList(list: string|Array<string>): Receiver[] {
        if (typeof list === 'string') {
            return list.split(',').map((el) => {
                return {
                    email:  el.trim(),
                    status: 'pending',
                    id:     +(Date.now() + ((1 - Math.random()) * 100).toFixed())
                }
            });
        } else if (typeof list.map === 'function') {
            return list.map((el) => {
                return {
                    email:  el.trim(),
                    status: 'pending',
                    id:     +(Date.now() + ((1 - Math.random()) * 100).toFixed())
                }
            });
        } else {
            return;
        }
    }
}