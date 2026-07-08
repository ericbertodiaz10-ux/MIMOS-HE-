import express from 'express'; 
import { 
    getUsersController, 
    getUsuarioPorId, 
    actualizarUsuario 
} from '../../controllers/User.js'; 

const router = express.Router(); // 👈 Esta línea debe estar SOLO UNA VEZ aquí arriba.

// Definición de las rutas
router.get('/', getUsersController);         
router.get('/:id', getUsuarioPorId);       
router.put('/:id', actualizarUsuario);     

export default router;