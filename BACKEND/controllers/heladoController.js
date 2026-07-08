import { obtenerTodos, obtenerporId, obtenerPorCategoria, crearHelado, actualizarHelado, eliminarHelado } from '../models/heladoModel.js';

export const listarHelados = async (requestAnimationFrame, res) => {
    try {
        const { data, error } = await 
        obtenerTodos();
        if (error) return res.status(500).json({error: 'Error al obtener'});
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

export const obtenerHelado = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await
        obtenerporId(id);
        if (eror || !data) return
        res.status(404).json({error: 'No encontrado'});
        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error: error.message});
    }
};

export const obtenerPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const { data, error } = await 
        obtenerPorCategoria(categoria);
        if (error) return res.status(500).json({ error: 'Error'});
        return res.status(200).json(data);
    }catch (error) {
        return escape.status(500).json({error: error.message});
    }
};

export const crear = async (req, res) => {
    try {
        // 1. Corregido 'decription' a 'descripcion' para que coincida abajo
        const { nombre, descripcion, precio, stock, imagen_url, categoria, sabor } = req.body;

        // 2. Corregido el error de duplicación y el nombre de 'precio'
        if (!nombre || !precio || !imagen_url) {
            return res.status(400).json({ error: 'nombre, precio e imagen_url requeridos' });
        }

        // 3. El 'await' debe ir en la misma línea antes de ejecutar la función
        const { data, error } = await crearHelado({
            nombre, descripcion, precio, stock, imagen_url, categoria, sabor
        });

        // 4. El manejo de las respuestas debe estar DENTRO del bloque try
        if (error) {
            return res.status(500).json({ error: 'Error al crear' });
        }

        return res.status(201).json({ message: 'creado', helado: data[0] });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const editar = async (req, res) =>{
    try {
        const { id } = req.params;
        const { data, error } = await actualizarHelado(id, req.body);
        if (error) return res.status(500).json({ error: 'Error al actualizar' });
            return res.status(200).json({
                message: 'Actualizado', helado: data[0] });
    } catch (error) {
        return res.status(500).json({error: error.message });
    }
};

export const eliminar= async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await 
        eliminarHelado(id);
        if (error) return res.status(500).json({error: 'Error al eliminar' });
        return res.status(200).json({message: 'Eliminado' });
    }catch (error) {
        return res.status(500).json({error: error.message });
    }
};




