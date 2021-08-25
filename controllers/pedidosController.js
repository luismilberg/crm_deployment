const Pedidos = require('../models/Pedidos');

// Nuevo pedido
exports.nuevoPedido = async (req, res, next) => {
    const pedido = new Pedidos(req.body);
    try {
        await pedido.save();
        res.json({ mensaje : 'Se agregó un nuevo pedido'});
    } catch (err) {
        console.log(err);
        next();
    }
}

// Muestra todos los pedidos
exports.mostrarPedidos = async (req, res, next) => {
    try {

        const pedidos = await Pedidos.find()
            .populate('cliente')
            .populate({
                path: 'pedido._id',
                model: 'Productos'
            });

        res.json(pedidos);
    } catch (err) {
        console.log(err);
        next();
    }
}

// Muestra un pedido por su ID
exports.mostrarPedido = async (req, res, next) => {
    const pedido = await Pedidos.findById(req.params.id)
        .populate('cliente')
        .populate({
            path: 'pedido._id',
            model: 'Productos'
        });

    if(!pedido){
        res.json({ mensaje : 'Ese pedido no existe'});
        return next();
    }

    // Mostrar el pedidio
    res.json(pedido);
}

// Actualizar un pedido por id
exports.actualizarPedido = async (req, res, next) => {
    try {
        let pedido = await Pedido.findOneAndUpdate({ _id : req.params.id} , req.body, { new : true})
            .populate('clinte')
            .populate({
                path: 'pedido._id',
                model: 'Productos'
            });
        res.json(pedido);
    } catch (err) {
        console.log(err);
        next();
    }
}

// Eliminar un pedido por id
exports.eliminarPedido = async ( req, res, next ) => {
    try {
        await Pedidos.findByIdAndDelete({ _id : req.params.id});
        res.json({ mensaje : 'El pedido fue eliminado correctamente'});
    } catch (err) {
        console.log(err);
        next();
    }
}