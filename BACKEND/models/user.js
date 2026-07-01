// models/user.js
import { supabase } from '../config/supabase.js';

// 1. Obtener todos los usuarios
export const getUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol'); // <- Corregido: añadida coma entre id y nombre
    return { data, error };
};

// 2. Obtener un usuario por ID (¡Esta faltaba para tu controlador!)
export const obtenerUsuariosPorId = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol')
        .eq('id', id)
        .single();
    return { data, error };
};

// 3. Crear un nuevo usuario
export const crearUser = async (nombre, email, password, rol = 'usuario') => {
    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nombre, email, password, rol }])
        .select('*')
        .single(); 

    return { data, error };
};

// 4. Actualizar usuario (Renombrada para que coincida con el controlador)
export const actualizarUsuario = async (id, campos) => {
     const { data, error } = await supabase
        .from('usuarios')
        .update(campos)
        .eq('id', id)
        .select('id, nombre, email, rol')
        .single();
    return { data, error };
};

// 5. Eliminar usuario
export const eliminarUser = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .select('*')
        .single();
    return { data, error };
};

// 6. Obtener usuario por email
export const getUserEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol')
        .eq('email', email)
        .single();
    return { data, error };
};

// 7. Obtener un usuario por email para el login
export const obtenerUsuarioPorEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, password, rol') //  
        .eq('email', email) //  
        .single();
    return { data, error };
};
