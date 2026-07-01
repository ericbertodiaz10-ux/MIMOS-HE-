import {supabase} from "../config/supabase.js";

//crear un codigo de recuperacion 
export const crearCodigoRecuperacion = async (usuarioId, codigo) => {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //expira en 15

    const { data, error } = await supabase
        .from('recuperar')
        .insert({
            usuario_id: usuarioId,
            codigo: codigo,
            expires_at: expiresAt.toISOString()
        })
        .select(); 

        return { data, error };
};

// obtener codigo no utilizado pir el usuario
export const obtenerCodigoValido = async (usuarioId, codigo) => {
    const { data, error } = await supabase
    .from('recuperar')
        .select('*')
        .eq('usuario_id, usuarioId')
        .eq('codigo', codigo) 
        .eq('usado', false)
        .gt('expires_at', new Date().toISOString())
        .single();

        return {data, error };
         
};

// marcar codigo como usado
export const marcarComoUsado = async (codigoId) => {
    const { data, error }  = await supabase
    .from('recuperar')
    .update({ usado: true})
    .eq('id', codigoId);

    return { data, error };
};