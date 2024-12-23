// src/utils/emailUtils.ts
import nodemailer from 'nodemailer';

interface KeyData {
    publicKey: string;
    privateKey: string;
    digest?: string;
    keyCoordinate?: string;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code for E-Voting Registration',
            html: `
                <h2>Your Verification Code</h2>
                <p>Please use the following code to verify your email: <strong>${code}</strong></p>
                <p>This code will expire in 10 minutes.</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Send verification email error:', error);
        return false;
    }
}

export async function sendKeys(email: string, keys: KeyData): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your E-Voting Keys',
            html: `
                <h2>Your E-Voting Keys</h2>
                <p>Please store these keys securely. You will need them for voting.</p>
                
                <h3>Public Key:</h3>
                <pre style="background-color: #f5f5f5; padding: 10px; overflow-wrap: break-word;">${keys.publicKey}</pre>
                
                <h3>Private Key:</h3>
                <pre style="background-color: #f5f5f5; padding: 10px; overflow-wrap: break-word;">${keys.privateKey}</pre>
                
                ${keys.digest ? `
                <h3>Key Digest:</h3>
                <pre style="background-color: #f5f5f5; padding: 10px; overflow-wrap: break-word;">${keys.digest}</pre>
                ` : ''}
                
                ${keys.keyCoordinate ? `
                <h3>Key Coordinates:</h3>
                <pre style="background-color: #f5f5f5; padding: 10px; overflow-wrap: break-word;">${keys.keyCoordinate}</pre>
                ` : ''}
                
                <p style="color: red;"><strong>Important:</strong> Keep your private key and other credentials secure and do not share them with anyone.</p>
                <p>Store this information safely as it will be required for the voting process.</p>
            `
        });
        return true;
    } catch (error) {
        console.error('Send keys email error:', error);
        return false;
    }
}