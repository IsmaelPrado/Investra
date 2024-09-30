import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, '..', 'token.json'); // Ruta al token.json

const sendEmail = async () => {
    const { client_secret, client_id, redirect_uris } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'credentials.json'), 'utf-8')).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Cargar el token
    const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
    oAuth2Client.setCredentials(JSON.parse(token));

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const email = [
        `From: "Tu Nombre" <vansestilo200@gmail.com>`,
        `To: "Destinatario" <vansestilo200@gmail.com>`,
        `Subject: Prueba de correo`,
        ``,
        `Este es un correo de prueba enviado desde Node.js usando la API de Gmail.`,
    ].join('\n');

    const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    try {
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: base64EncodedEmail,
            },
        });
        console.log('Email enviado: ', response.data);
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
    }
};

sendEmail();
