import express from 'express';
import { listarHelados, obtenerHelado, obtenerPorCategoria, crear, editar, eliminar } from '../../controllers/helado';
import { eliminarHelado } from '../../models/helado';
import { verificarToken, verificarAdmin } from '../../middleware/authmiddleware.js';

const router = express.Router();


//RUTAS PUBLICAS
//GET - Obtener todos
router.get('/helados', listarHelados);

// GET -Obtener por id
router.get('/helados/:id', obtenerHelado);


// rutas privadas  

// GET - Obtener por categoria
router.get('/helados/categoria/:categoria', obtenerPorCategoria);

// POS - Crear helado
router.post('/helados', crear);

// PUT- Actualizar helado
router.put('/helados/:id', editar);

// DELETE - Eliminar helado
router.delete('/helados/:id', eliminar);

 
 

// rutas privadas (requieren token y rol admin)

// POST - Crear helado
router.post('/helados',verificarToken, verificarAdmin, crear);

// PUT - Actualizar helado
router.put('/helados/:id', verificarToken,verificarAdmin, editar);

// DELETE - Eliminar helado
router.delete('/helados/:id', verificarToken,verificarAdmin, eliminar);

export default router;