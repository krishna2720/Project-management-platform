import Mailgen from "mailgen";  //for generating email template which we want to send 
import nodemailer from "nodemailer" ; //Method for sending email: Just provide options and you can use this sendMail method anywhere


const sendEmail=async (options) => {  //Options are all attributes of email (to,subject,content)
    //1. Preparing email to send
    //Initialize Mailgen reference with default themes and brands
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Project Management Platform",
            link:"https://projectmanagementplatform.com"
        }
    })

    //Textual content of mail
    const emailTextual=mailGenerator.generatePlaintext(options.mailgenContent)
    //Generate content that supports HTML
    const emailHtml=mailGenerator.generate(options.mailgenContent)
    
    
    // Actual sending of email: Create transport of nodemailer then send
    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail={
        from:"mail.projectmanagementplatform@example.com",   //sender email
        to:options.email,  //reciever email
        subject:options.subject,   //subject which you want to send 
        text:emailTextual,   //text content 
        html:emailHtml          //Browser will auto pick textual content or html content depending on support
    }

    //Since sending mails can fail, so use try catch
    try {
        await transporter.sendMail(mail)            //Send the mail
    } catch (error) {
        console.error("Email Service failed silently . Make sure you have provided mailtrap credentials in .env file")
        console.error("Error: ",error)
    }
}


//Now just provide the options and you can use this send email function anywhere





//generate the email content for sending the email at front end 
 
//generation of content for verification email
const emailVerificationMailgenContent =(username,verificationUrl) => {
    return {
        body: {
            name:username,
            intro:"Welcome to our App! We're excited to have you on the board",
            action:{
                instructions: "TO Verify your email,please click on the following button ",
                button: {
                    color: "#1aae5aff",
                    text: "Verify your email",
                    link: verificationUrl
                }
            },
            outro: "Need help or have any query, Just reply to this e-mail. We would love to help !!"
        }
    }
}

//generate the content for password reset
const forgotPasswordMailgenContent =(username,passwordResetUrl) => {
    return {
        body: {
            name:username,
            intro:"We got a request to reset password of your account",
            action:{
                instructions: "To reset your password, please click on button which is given below",
                button: {
                color:"#aaaabb",
                text: "Reset the Password",
                link: passwordResetUrl
                }
            },
            outro: "Need help or have any query, Just reply to this e-mail. We would love to help !! "
        }
    }
}

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}    