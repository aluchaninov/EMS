import {Receiver} from './receiver';

export class User {
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