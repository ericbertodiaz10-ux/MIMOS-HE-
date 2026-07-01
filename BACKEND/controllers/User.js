import { getUsuarios, obtenerUsuarioPorEmail, obtenerUsuariosPorId, actualizarUsuario as actualizarUsuarioModelo } from "../models/user.js";

// 1. Obtener todos los usuarios 
export const getUsersController = async (req, res) => {
    try {
        const { data, error } = await getUsuarios();
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        return res.status(200).json({
            usuarios: data
        });
    } catch (error) {
        console.error('Error al obtener a los usuarios', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// 2. Obtener un usuario por ID 
export const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await obtenerUsuariosPorId(id);

        if (error || !data) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            usuario: data
        });
    } catch (error) {
        console.error('Error al obtener al usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 3. Actualizar un usuario por ID (Nombrado exactamente como lo piden tus rutas)
export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body; 

        // Verificamos si el usuario existe antes de actualizar
        const { data: usuarioExistente, error: errorBusqueda } = await obtenerUsuariosPorId(id);
        
        if (errorBusqueda || !usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Llamamos a la función del modelo de supabase
        const { data, error } = await actualizarUsuario(id, datosActualizados);

        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }

        return res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: data
        });
    } catch (error) {
        console.error('Error en el controlador al actualizar usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};