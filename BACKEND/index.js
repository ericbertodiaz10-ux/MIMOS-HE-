import 'dotenv/config';
import express from 'express';
import { connectaDB } from './config/supabase.js';
import routerAuth from './routes/auth.js';
import UserRouter from './routes/User.js';
import PedidosRouter from './routes/pedidos.js';

connectaDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        Mensaje: "Bienvenido al backend de MIMOS",
        Estado: "En linea",
        Version: "1.0.0"
    });
});

// Rutas de autenticacion
app.use('/auth', routerAuth);
app.use('/usuarios', UserRouter);
app.use('/pedidos', PedidosRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 Registro: http://localhost:${PORT}/auth/registro`);
});