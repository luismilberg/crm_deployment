const express = require("express");
const router = express.Router();

const clientesController = require('../controllers/clientesController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

// Middleware para proteger las rutas
const auth = require('../middelware/auth');



module.exports = function () {

    /** CLIENTES */
    
    // Agrega nuevos clientes vía POST
    router.post('/clientes', clientesController.nuevoCliente);

    // Obtener todos los clientes
    router.get('/clientes', 
        auth,
        clientesController.mostrarClientes
    );

    // Muestra un cliente en específico por id
    router.get('/clientes/:id', 
        auth,
        clientesController.mostrarCliente);

    // Actualizar cliente
    router.put('/clientes/:id',  
        auth,
        clientesController.actualizarCliente);

    // Eliminar un cliente
    router.delete('/clientes/:id',  
        auth,
        clientesController.eliminarCliente);

    /** PRODUCTOS */

    // Nuevos productos
    router.post('/productos',  
        auth,
        productosController.subirArchivo,
        productosController.nuevoProducto
    );

    // Muestra todos los productos
    router.get('/productos',  
        auth,
        productosController.mostrarProductos)

    // Muestra un producto en específico por id
    router.get('/productos/:id',  
        auth,
        productosController.mostrarProducto)

    // Actualizar productos
    router.put('/productos/:id',  
        auth,
        
        productosController.subirArchivo,
        productosController.actualizarProducto
    );

    // Eliminar productos
    router.delete('/productos/:id',  
        auth,
        productosController.eliminarProducto);

    // Búsqueda de productos
    router.post('/productos/busqueda/:query',  
        auth,
        productosController.buscarProductos);

    /** PEDIDOS */
    // Nuevos pedidos
    router.post('/pedidos/nuevo/:idUsuario',  
        auth,
        pedidosController.nuevoPedido);

    // Mostrar todos los pedidos
    router.get('/pedidos',  
        auth,
        pedidosController.mostrarPedidos)

    // Mostrar un pedido por su ID
    router.get('/pedidos/:id',  
        auth,
        pedidosController.mostrarPedido);

    // Actualizar pedidos
    router.put('/pedidos/:id',  
        auth,
        pedidosController.actualizarPedido);

    // Eliminar un pedido por su ID
    router.delete('/pedidos/:id',  
        auth,
        pedidosController.eliminarPedido)


    // Usuarios
    router.post('/crear-cuenta',  
        auth,
        
        usuariosController.registrarUsuario
    );

    router.post('/iniciar-sesion', 
        usuariosController.autenticarUsuario
    );

    return router;
};
