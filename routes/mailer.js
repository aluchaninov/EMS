const nodemailer = require('nodemailer');
const config = require('../config.json');

class Mailer {
    constructor(opts) {
        if (!opts) return;

        this.auth = `smtps://${opts.username}%40gmail.com:${opts.password}@smtp.gmail.com`;
        this.transporter = nodemailer.createTransport(this.auth);
        this.userMail = opts.userMail;
        this.subject = opts.subject;
        this.text = opts.text;
    }

    sendMail(receiversList) {
        if (!receiversList || !receiversList.forEach) {
            return 'Please provide correct list of receivers';
        }
        let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;
        let r = [];

        receiversList.forEach((receiver, i, l) => {
            r.push(new Promise((resolve, reject) => {
                    let result = {
                        id: receiver['id']
                    };

                    if (!pattern.test(receiver['email'])) {
                        console.info(`email to ${receiver['email']} was\'t sent. Bad email`);
                        result.success = false;
                        resolve(result);
                        return;
                    }
                let text = this.text.replace(/\n/ig, '<br>');

                    const mailOptions = {
                        // from:    'me',
                        to:          receiver['email'],
                        priority:    'high',
                        subject:     this.subject,
                        // text:        text, // plaintext body
                        html:        `<p>${text}</p><br><br><br>Z poważaniem,<br>Koło Naukowe Zarządzania i Marketingu UMCS <br>
                                        <img src="cid:bjgdnkbgfjbkfknbkf" width="200"/> <img src="cid:vxdbv87dufdbdx" width="70"/>`, // html body
                        attachments: [
                            {
                                filename: 'umcs-logo.jpg',
                                path:     config.attachmentsFolder + 'umcs-logo.jpg',
                                cid:      'bjgdnkbgfjbkfknbkf'
                            },
                            {
                                filename: 'knzim-logo.jpg',
                                path:     config.attachmentsFolder + 'knzim-logo.jpg',
                                cid:      'vxdbv87dufdbdx'
                            }
                        ]
                    };

                    this.transporter.sendMail(mailOptions, function(error, info) {
                        result.info = info;

                        if (error) {
                            result.message = error;
                            reject(result);
                            return false;
                        }

                        console.info(`email to ${receiver['email']} was sent successfully`);

                        result.message = `${receiver['email']}`;

                        if (i === l.length - 1) {
                            result.isLast = true;
                        }

                        resolve(result);
                    });

                })
            );
        });

        return r;
    }
}

module.exports = Mailer;