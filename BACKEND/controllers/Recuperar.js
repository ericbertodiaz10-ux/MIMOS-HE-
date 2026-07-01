import { crearCodigoRecuperacion, obtenerCodigoValido, marcarComoUsado } from "../models/Recuperar.js";
import { obtenerUsuarioPorEmail, actualizarUsuario as actualizarUsuarioModelo } from '../models/user.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// configuramos el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. Configurar la lógica para enviar el correo de verificación
export const forgoPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electronico es requerido' });
        }

        // verificar si el usuario existe
        const { data: usuario, error: errorUsuario } = await obtenerUsuarioPorEmail(email);
        if (errorUsuario || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // generamos los codigos de recuperacion
        const codigo = Math.floor(10000 + Math.random() * 90000).toString();

        // Guardamos el codigo en la base de datos
        const { error: errorCodigo } = await crearCodigoRecuperacion(usuario.id, codigo);
        if (errorCodigo) {
            return res.status(500).json({ error: 'Error al generar el codigo de recuperacion' });
        }

        // creamos el gmail del codigo
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Tu codigo de recuperacion es: ${codigo}`,
            html: `
                <h2>recuperacion de contraseña</h2>
                <p>Hola ${usuario.nombre || 'usuario'}</p>
                <p>Tu codigo de recuperacion es:</p>
                <h1 style="color:#39a900; font-size: 36px;">${codigo}</h1>
                <p>Este codigo es valido por 15 minutos. Si no solicitaste este codigo, por favor ignora este correo</p>
                <p>Gracias,</p>
                <p>El equipo de soporte</p>
                <p>No compartas este codigo con nadie</p>
            `
        });

        return res.status(200).json({ message: 'Codigo de recuperacion enviado por el correo' });

    } catch (error) {
        console.error('Error en forgoPassword', error);
        return res.status(500).json({ error: 'Error al enviar el codigo de recuperacion' });
    }
};

// 2. Función para verificar únicamente el código
export const verificarCodigo = async (req, res) => {
    try {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return res.status(400).json({ error: 'El correo y el código son requeridos' });
        }

        const { data: usuario } = await obtenerUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { data: codigoRecord } = await obtenerCodigoValido(usuario.id, codigo);
        if (!codigoRecord) {
            return res.status(400).json({ error: 'Codigo de recuperación invalido o expirado' });
        }

        return res.status(200).json({ message: 'Código verificado con éxito', valido: true });
    } catch (error) {
        console.error('Error en verificarCodigo', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 3. Cambiar contraseña y verificar el codigo (Reset de contraseña)
export const forgotPassword = async (req, res) => {
    try {
        const { email, codigo, newPasswords } = req.body;

        if (!email || !codigo || !newPasswords) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // verificamos si el usuario esta en la base de datos
        const { data: usuario } = await obtenerUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // verificar el codigo de recuperacion de la base de datos
        const { data: codigoRecord } = await obtenerCodigoValido(usuario.id, codigo);
        if (!codigoRecord) {
            return res.status(400).json({ error: 'Codigo de recuperacion invalido o expirado' });
        }

        // encriptamos la nueva contraseña
        const hashePassword = await bcrypt.hash(newPasswords, 10);

        // actualizamos la contraseña del usuario en la base de datos
        const { error: updateError } = await actualizarUsuarioModelo(
            usuario.id, { password: hashePassword }
        );
        if (updateError) throw updateError;

        // marcamos el codigo como usado
        await marcarComoUsado(codigoRecord.id);

        // respondemos al cliente que la contraseña se cambio exitosamente
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Contraseña cambiada exitosamente',
            html: `
                <div style="font-family:sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #333;">Notificacion de cambio de contraseña</h2>
                    <p>Hola ${usuario.nombre || "Usuario"},</p>
                    <p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #39a900; margin-top: 20px;">
                        <p style="margin: 0; font-size: 14px; color: #555;">
                            Si no realizaste este cambio, te recomendamos que contactes a nuestro equipo de soporte inmediatamente.
                        </p>
                    </div>
                    <p style="color: #555; font-size: 14px; margin-top:30px">Gracias,</p>
                </div>
            `
        });

        return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });

    } catch (error) {
        console.error('Error en forgotPassword', error);
        return res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
};