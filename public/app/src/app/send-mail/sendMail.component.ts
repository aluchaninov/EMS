import {Component} from '@angular/core';
import {FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {SendMailService} from '../services/sendMail.srv';

const urlToUploadFiles = 'api/sendFile';

@Component({
    selector:    'send-mail',
    templateUrl: './sendMail.component.html',
    styleUrls:   ['./sendMail.component.css']
})
export class SendMail {
    message: string;
    user: User;
    username: String;
    sub;
    sendMailSrv: SendMailService;
    uploader: FileUploader = new FileUploader({url: urlToUploadFiles, autoUpload: true});
    listOfBadEmails: Receiver[];
    private credsKey: string = 'emailCreds';

    constructor(sendMailSrv: SendMailService) {
        let creds = this.getUser();
        this.user = creds ? new User(creds.username, creds.password) : new User('', '');
        this.sendMailSrv = sendMailSrv;
        this.user.receiversList = [];
        this.user.receiversMails = '';
    }

    send({form, valid}) {
        console.info(form);

        if (valid) {
            form.value.receiversList = this.user.receiversList;

            this.user = form.value;

            if (this.user.receiversList.length > 100) {
                this.handleError('You\'ve entered more than 100 emails. Gmail allows to send less than 100 per day.');
                return false;
            }

            this.sub && this.sub.unsubscribe();

            this.sub = this.sendMailSrv.sendMail(this.user)
                           .subscribe(
                               (r: Receiver) => {
                                   let sentEmail = this.user.receiversList.find((e) => e.id === r.id);
                                   //case for handling incorrect email
                                   sentEmail.status = r['success'] === false ? 'error' : 'success';
                               },
                               (e) => {
                                   let notSentEmail = this.user.receiversList.find((e) => e.id === e.id);
                                   //case for normal errors - when something happend during email sending
                                   notSentEmail.status = 'error';
                               }, () => {
                                   console.info('done');
                               });
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

    processEmailsFile(file) {
        this.uploader.onCompleteItem = (item, response: string, status: number) => {
            if (status === 200) {
                let res = JSON.parse(response);
                this.verifyMails(res)
            } else {
                this.showMessage('Provided file is not supported', true);
            }
        }
    }

    verifyMails(mails) {
        this.listOfBadEmails = [];
        this.user.receiversList = [];
        this.user.receiversMails = '';

        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
            data = SendMail.processEmailsList(mails);

        data.forEach((val => {
            if (!pattern.test(val.email)) {
                this.listOfBadEmails.push(val);
            } else {
                this.user.receiversList.push(val);

                let email = this.user.receiversList.length > 1 ? ', ' + val.email : val.email;

                this.user.receiversMails += email;
            }
        }));
    }

    clearReceiversList(inputID) {
        this.listOfBadEmails = this.user.receiversList = [];

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

    static processEmailsList(list: string|Array<string>): Receiver[] {
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

class Receiver {
    email: string;
    status: string;
    id: Number;
}

class User {
    username: string;
    password: string;
    valid?: boolean;
    value?: any;
    receiversList?: Receiver[];
    receiversMails?: string;
    subject?: string;
    text?: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}