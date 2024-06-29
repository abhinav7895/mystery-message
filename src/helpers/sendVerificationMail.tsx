import { ApiResponse } from "@/types/ApiResponse";
import nodemailer from "nodemailer"
import { VerificationMail } from "@/emails/verification-mail";
import { render } from "@react-email/render";


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.PASSWORD,
    },
});

export async function sendVerificationMail(
    email: string,
    userName: string,
    verifyCode: string): Promise<ApiResponse> {
    try {
        const emailHtml = render(<VerificationMail verifyCode={verifyCode} userName={userName} />);

        const options = {
            from: 'Interview Genie <noreply@interviewgenie.vercel.app>',
            to: email,
            subject: 'Verify your email address',
            html: emailHtml,
        };

        await transporter.sendMail(options);

        return {
            success: true,
            message: "Verification email sent successfully."
        }
    } catch (error) {
        console.error("Error sending verification email : " + error);

        return {
            success: false,
            message: "Failed to send verification email.",
        }
    }
}