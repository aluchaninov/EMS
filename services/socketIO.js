let io,
    fs = require('fs'),
    config = require('./../config.json'),
    Mailer = require('./../routes/mailer');

module.exports = function(server) {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
        socket.on('send-mails', (message) => {
            let query = {
                username: message.username,
                password: message.password,
                userMail: message.userMail,
                subject:  message.subject,
                text:     message.text
            };

            let mailer = new Mailer(query);

            let mailsInProgress = mailer.sendMail(message.receiversList);

            console.info('mailsInProgress has ', mailsInProgress.length, ' promises');

            if (mailsInProgress.length === 0) {
                io.emit('error', {message: {response: 'Please provide at least one email'}});
                return;
            }

            mailsInProgress.forEach && mailsInProgress.forEach(function(mail) {
                mail.then((r) => {
                        io.emit('mails-sent', r);
                    },
                    (err) => {
                        io.emit('mails-sent-error', err);
                    });
            });
        });
    });
};