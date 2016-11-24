import {Component} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

import {SendMailService} from '../services/sendMail.srv';
import {Receiver} from '../schemas/receiver';
import {User} from '../schemas/user';
import './sendMail.component.scss';

const urlToUploadFiles = 'api/sendFile';

@Component({
    selector:    'send-mail',
    templateUrl: './sendMail.component.html',
})
export class SendMail {
    message: string;
    user: User;
    username: String;
    sub;
    sendMailSrv: SendMailService;
    uploader: FileUploader = new FileUploader({url: urlToUploadFiles, autoUpload: true});
    successCounter: number;
    listOfBadEmails: Receiver[];
    listOfLimitedEmails: Receiver[];
    sendingInProgress: boolean;
    private credsKey: string = 'emailCreds';

    constructor(sendMailSrv: SendMailService) {
        let creds = this.getUser();
        this.user = creds ? new User(creds.username, creds.password) : new User('', '');
        this.sendMailSrv = sendMailSrv;
        this.user.receiversList = this.listOfLimitedEmails = [];
        this.user.receiversMails = '';
    }

    send({form, valid}, e) {
        if (e) {
            e.preventDefault();
        }
        console.info(form);

        if (valid) {
            this.successCounter = 0;

            form.value.receiversList = this.user.receiversList;

            this.user = form.value;

            if (this.user.receiversList.length > 100) {
                this.handleError('You\'ve entered more than 100 emails. Gmail allows to send less than 100 per day.');
                return false;
            }

            this.sub && this.sub['unsubscribe'] && this.sub['unsubscribe']();

            this.sub = this.sendMailSrv.sendMail(this.user).subscribe(
                (r: Receiver) => {
                    let sentEmail = this.user.receiversList.find((e) => e.id === r.id);
                    //case for handling incorrect email
                    if (r['success'] === false) {
                        sentEmail.status = 'error';
                        sentEmail['message'] = r['message'];
                    } else {
                        sentEmail.status = 'success';
                        this.successCounter++;
                    }

                    if (this.successCounter === this.user.receiversList.length) {
                        this.sendingInProgress = false;
                    }
                },
                (e) => {
                    let notSentEmail = this.user.receiversList.find((e) => e.id === e.id);
                    //case for normal errors - when something happend during email sending
                    notSentEmail ? notSentEmail.status = 'error' : null;
                    console.info(e);
                    this.showMessage(e && e.message && e.message.response);
                    this.sendingInProgress = false;
                }, () => {
                    console.info('done');
                });

            this.sendingInProgress = true;
        } else {
            // console.info(form.controls);
            for (let key in form.controls) {
                if (key['errors']) {
                    console.info(form.controls[key]);
                }
            }
            this.handleError('Please verify data!!!')
        }
    }

    processEmailsFile(file: any) {
        this.uploader.onCompleteItem = (item, response: string, status: number) => {
            if (status === 200) {
                let res = JSON.parse(response);
                this.verifyMails(res);
            } else {
                this.showMessage('Provided file is not supported', true);
            }
        }
    }

    verifyMails(list: string|Array<string>) {
        let verifiedMails = this.sendMailSrv.verifyMails(list);
        console.info(verifiedMails);
        this.listOfBadEmails = verifiedMails.listOfBadEmails;
        this.user.receiversList = verifiedMails.willSendTo;
        this.user.receiversMails = verifiedMails.receiversMails;
        this.listOfLimitedEmails = verifiedMails.willNotSendTo;
    }

    clearReceiversList(inputID) {
        this.listOfBadEmails = this.user.receiversList = this.listOfLimitedEmails = [];

        this.user.receiversMails = '';

        if (inputID) window[inputID]['value'] = '';
    }

    private getUser(): User {
        let creds = localStorage.getItem(this.credsKey);

        return JSON.parse(creds);
    }

    private saveCreds(form): void {
        let creds = {username: form.username, password: form.password};

        localStorage.setItem(this.credsKey, JSON.stringify(creds));
    }

    private removeCreds(): void {
        delete this.user.username;
        delete this.user.password;
        localStorage.removeItem(this.credsKey);
    }

    private handleError(msg: string, e?: any) {
        if (e) {
            console.info(e);
        }

        this.showMessage(msg, true)
    }

    private showMessage(msg: string, shouldHide?: boolean) {
        this.message = msg;

        if (shouldHide) {
            setTimeout(() => {
                delete this.message;
            }, 3000);
        }
    }
}