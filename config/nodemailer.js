    import nodemailer from 'nodemailer';

    // const transporter = nodemailer.createTransport({
    //     host: 'smtp-relay.brevo.com',
    //     port: 587,
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.SMTP_PASS
    //     }
    // });



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: process.env.G_USER,
            pass: process.env.G_PASS
        }
    });

export { transporter };
    