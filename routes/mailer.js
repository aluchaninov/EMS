const nodemailer = require('nodemailer');

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
                    const mailOptions = {
                        // from:    'me',
                        to:      receiver['email'],
                        subject: this.subject,
                        text:    this.text, // plaintext body
                        //html:    '<b>Hello world ?</b>' // html body
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