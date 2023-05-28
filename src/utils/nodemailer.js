import { createTransport } from "nodemailer";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import loggerApp from '../utils/logger.utils.js'

dotenv.config();

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PWD,
  },
});

export const loadEmail = async (data) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: data.email,
    subject: "Nuevo Usuario",
    html: `<div>
            <h4>Un nuevo cliente se registro en la Web</h4>
            <ul>
                <li>Nombre: ${data.first_name}</li>
                <li>Email: ${data.email}</li>
                <li>Foto: ${data.avatar}</li>
            </ul>
    </div>`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    loggerApp.error (error);
  }
};

// Mail para Confirmación de Orden
export const orderEmail = async (data, html) => {

  let mensaje = ToHTML(html);  
  const mailOptions = {
    from: 'e-Commerce <' + process.env.GMAIL_USER + '>',
    to: data.email, 
    subject: `Realizaste un Pedido - ${html._id}`,    
    html: mensaje,
  };  

  nodemailer.getTestMessageUrl(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    loggerApp.error (error);
  }
};

const ToHTML = (html) =>{
  let msgHTMLHeader = '<table><tbody>'
  let msgHTMLMsg = ''
  html.products.forEach(producto => 
    msgHTMLMsg = msgHTMLMsg + `<tr><td><h5>${producto.codigo}</h5></td><td><h5>${producto.cantidad}</h5></td><td><p>${producto.precio}</p></td><td><p>${producto.precio}x${producto.cantidad}u.</p></td></tr>`    
  );
  let msgHTMLFoot = `<tr>
    <td><h4>TOTAL COMPRA: $${html.total}</h4></td>
    </tr></tbody></table><h2>GRACIAS POR TU COMPRA</h2>`
  return msgHTMLHeader + msgHTMLMsg + msgHTMLFoot
}
