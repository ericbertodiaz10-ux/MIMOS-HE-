import nodemailer from 'nodemailer'; 

const transporter = 
nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        PASS: Process.env.EMAIL_PASSWORD
    }
});

export const enviarConfirmacionPedido = async (email, nombreUsuario, pedidoId, total) =>{
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        sudject:`✅ Pedido confirmado - Heladeria Minions #${pedidoId}`, html:`

        ¡Gracias por tu pedido!


        Hola $[nombreUsuario],

        Tu pedido ha sido confirmado exitosamente.

        Numero de Pedido: #${pedidoId}


        Total: $${total.toLocaleString('es-CO')}


        Pronto nos comunicaremos contigo con los detalles de entrega.



        Saludos.
        Equipo Heladeria Minions 🍦



            `
    };

    try {
        await
        transporter.sendMail(mailOptions);
        return { sucess: true, message:
            'Correo enviado' };
        } catch (error) {
            console.error('Error al enviar correo:', Error);
            return { success: false, error: error.message };
        }
    };
    
            
            
            
    