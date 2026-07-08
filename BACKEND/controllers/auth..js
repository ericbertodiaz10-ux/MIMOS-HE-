// controllers/user.js
import bcrypt from 'bcrypt';
import { crearUser, getUserEmail } from '../models/User.js';

// Registro de usuario
export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar datos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: "Faltan campos obligatorios (nombre, email, password)"
            });
        }

        // Verificar si el email ya existe
        const { data: usuarioExiste } = await getUserEmail(email);
        if (usuarioExiste) {
            return res.status(400).json({
                error: "El email ya está registrado"
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Rol por defecto
        const rol_defecto = 'usuario';

        // Crear usuario guardar en la base de datos
        const { data: nuevoUsuario, error } = await crearUser(
            nombre,
            email,
            hashedPassword,
            rol_defecto
        );

        if (error) {
            console.error("Error en el registro:", error);
            return res.status(500).json({
                error: "Error al crear el usuario en la base de datos"
            });
        }

        // Respuesta exitosa
        return res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};


//crear login 
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y password son requeridos" });
        }

        // Buscar usuario
        const { data: usuario, error } = await getUserEmail(email);
        if (error || !usuario) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Comparar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol 
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Token dura 7 días
        );

        return res.json({
            message: "Login exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            },
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
    