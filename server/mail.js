const nodemailer = require('nodemailer');

/** @type {nodemailer.Transporter} */
let transporter = null;

const connectNodeMailer = () => {
    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        secure: true,
    });
}

const mailTempltePlainText = "Hey there! This is our first message sent with Nodemailer";
const mailTemplateHTML = `<b>Hey there! </b>
<br>This is our first message sent with Nodemailer<br/>`;

const sendApprovalLetters = async (allExaminers) => {

    const promiseArray = allExaminers.map(examiner => {
        const mailData = {
            from: 'youremail@gmail.com',  // sender address
            to: examiner.email,   // list of receivers
            subject: 'Selected as Examiner',
            text: mailTempltePlainText,
            html: mailTemplateHTML,

            // An array of attachments
            attachments: [
                {
                    filename: 'text notes.txt',
                    path: 'notes.txt'
                },
            ]
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailData, function (err, info) {
                if (err) reject(err)
                else resolve(info);
            });
        })
    });

    return await Promise.all(promiseArray);
}

module.exports = {
    connectNodeMailer, sendApprovalLetters
}
