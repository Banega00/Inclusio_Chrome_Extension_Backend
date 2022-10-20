import { createTransport, Transporter } from 'nodemailer'
import CustomError from '../errors/CustomError';
import { UserEntity } from '../models/entities/User.entity';
import { ErrorStatusCode } from '../status-codes';
import { env } from '../utils/env-wrapper';
import Logger from '../utils/Logger';

export class MailingService {

    private transporter: Transporter;
    private logger: Logger;
    constructor() {
        this.transporter = createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            secure: false, // true for 465, false for other ports
            auth: {
                // user: env.mail.username, 
                user: env.mail.username,
                // pass: env.mail.password
                pass: env.mail.password
            },
        });

        this.logger = new Logger(this.constructor.name);
    }

    sendMail = async (options:{
        senderName:string, 
        recipients: string[],
        subject: string, text: string, html: string}) => {
        try{
            await this.transporter.sendMail({
                from: `"${options.senderName}" ${env.mail.username}`, // sender address
                to: options.recipients.join(','), // list of receivers
                subject: options.subject, // Subject line
                text: options.text, // plain text body
                html: options.html, // html body
            });

            this.logger.info(`Mail successfully sent!`)
        }catch(error){
            this.logger.error(`Error sending mail`, error)
            throw new CustomError({status: 500, code:ErrorStatusCode.ERROR_SENDING_MAIL, message: `Error sending mail`})
        }
    }

    consumerRequestedPage = async(user: UserEntity, pageUrl: string) => {
        this.logger.debug(`Sending mail to ${user.email}`)
        await this.sendMail({senderName:`Inclusio`, recipients: [user.email], subject:'Page request confirmation', 
        text:`Dear ${user.username}, you have successfully requested processing for the page on the following link: ${pageUrl}`,
        html:`<div>Dear ${user.username}, you have successfully requested processing for the page on the following link: <a href="${pageUrl}">${pageUrl}</a><div>`})
    }
}

