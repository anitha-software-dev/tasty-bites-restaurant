import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';

dotenv.config();

// Initialize SendGrid if API Key is present
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    console.log('✅ SendGrid HTTP API Initialized');
}

/**
 * Force IPv4 Resolution for Gmail SMTP Fallback
 */
async function getIpv4Host(hostname) {
    try {
        const { address } = await dns.lookup(hostname, { family: 4 });
        return address;
    } catch (error) {
        return hostname; 
    }
}

let resolvedHostUsed = 'not resolved';
let transporterInstance;

const createTransporter = async () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const resolvedHost = await getIpv4Host(host);
    resolvedHostUsed = resolvedHost;
    
    const port = parseInt(process.env.SMTP_PORT || '587');
    const isSecure = process.env.SMTP_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
        host: resolvedHost,
        port: port,
        secure: isSecure,
        auth: {
            user: (process.env.SMTP_USER || '').trim(),
            pass: (process.env.SMTP_PASS || '').trim(),
        },
        requireTLS: true,
        family: 4,
        tls: { rejectUnauthorized: false, servername: host },
        connectionTimeout: 10000, 
    });
};

const getTransporter = async () => {
    if (!transporterInstance) {
        transporterInstance = await createTransporter();
    }
    return transporterInstance;
};

const FROM_EMAIL = process.env.SMTP_USER || 'no-reply@tastybites.com';
const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL || 'anitha05staging@gmail.com';

/**
 * Universal Email Sender (HTTP API Priority, SMTP Fallback)
 */
const sendEmail = async (options) => {
    const { to, subject, html, cc, replyTo } = options;

    // 1. Try SendGrid HTTP API first (Bypasses Render Block)
    if (SENDGRID_API_KEY) {
        try {
            const msg = {
                to,
                from: FROM_EMAIL,
                subject,
                html,
                cc,
                replyTo
            };
            const [response] = await sgMail.send(msg);
            console.log(`🚀 Email delivered via SendGrid API to ${to}`);
            return { success: true, method: 'sendgrid', messageId: response.headers['x-message-id'] };
        } catch (error) {
            const errorBody = error.response ? error.response.body : null;
            const errorMessage = errorBody ? JSON.stringify(errorBody) : error.message;
            console.error('❌ SendGrid API Error:', errorMessage);
            
            // If on Render, don't even try SMTP because it will 100% timeout and hang the request
            if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
                return { success: false, error: `SendGrid API Error: ${errorMessage}. (SMTP Fallback skipped on Render due to port blocks)` };
            }
            // Fallthrough to SMTP only on local
        }
    }

    // 2. Fallback to SMTP (Local Dev / Paid Render)
    try {
        const t = await getTransporter();
        const info = await t.sendMail({
            from: `"Tasty Bites" <${FROM_EMAIL}>`,
            to,
            cc,
            replyTo,
            subject,
            html,
        });
        console.log(`📧 Email delivered via SMTP to ${to}`);
        return { success: true, method: 'smtp', messageId: info.messageId };
    } catch (error) {
        console.error("❌ Final Email Fallback Error:", error.message);
        return { success: false, error: error.message };
    }
};

export const sendBookingConfirmation = async (bookingData) => {
    const { fullName, email, referenceNumber } = bookingData;
    const html = `<h3>Reservation Confirmed</h3><p>Hi ${fullName}, your booking #${referenceNumber} is confirmed.</p>`;
    return await sendEmail({ to: email, subject: `Booking Confirmed #${referenceNumber}`, html, cc: RESTAURANT_EMAIL });
};

export const sendContactNotification = async (contactData) => {
    const { name, email, subject, message } = contactData;
    return await sendEmail({ 
        to: RESTAURANT_EMAIL, 
        replyTo: email,
        subject: `[Support] ${subject} from ${name}`, 
        html: `<h3>New Message</h3><p>${message}</p>` 
    });
};

export const sendCateringNotification = async (cateringData) => {
    const { name, email, details } = cateringData;
    return await sendEmail({ 
        to: RESTAURANT_EMAIL, 
        replyTo: email,
        subject: `[Catering] New Lead from ${name}`, 
        html: `<h3>New Enquiry</h3><p>${details}</p>` 
    });
};

export const sendOrderConfirmation = async (orderData) => {
    const { orderId, customerName, customerEmail, totalAmount } = orderData;
    const html = `<h3>Order Confirmed</h3><p>Hi ${customerName}, your order #${orderId} for £${totalAmount} is confirmed.</p>`;
    return await sendEmail({ to: customerEmail || RESTAURANT_EMAIL, subject: `Order Confirmed #${orderId}`, html });
};

export const verifyConnection = async () => {
    if (SENDGRID_API_KEY) return { success: true, method: 'SendGrid HTTP API' };
    
    try {
        const t = await getTransporter();
        await t.verify();
        return { success: true, method: 'SMTP', resolvedHost: resolvedHostUsed };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const sendTestEmail = async (targetEmail) => {
    const result = await sendEmail({ 
        to: targetEmail, 
        subject: "Tasty Bites - Delivery Test", 
        html: `<h2>Success!</h2><p>Integrated Delivery System is Operational.</p><p>Method: ${SENDGRID_API_KEY ? 'SendGrid HTTP API' : 'SMTP'}</p>` 
    });
    return result;
};

export default getTransporter;
