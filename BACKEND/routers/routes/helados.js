import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCategoria, crear, editar, eliminar } from '../../controllers/heladoController';
import { eliminarHelado } from '../../models/heladoModel';

const router = express.Router();

//GET - Obtener todos
router.get('/helados', listarHelados);

// GET -Obtener por id
router.get('/helados/:id', obtenerHelado);

// GET - Obtener por categoria
router.get('/helados/categoria/:categoria', obtenerPorCategoria);

// POS - Crear helado
router.post('/helados', crear);

// PUT- Actualizar helado
router.put('/helados/:id', editar);

// DELETE - Eliminar helado
router.delete('/helados/:id', eliminar);

export default router;