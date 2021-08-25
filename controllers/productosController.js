const Productos = require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


// Configuración de multer para subir archivos, verifica que sea de extensión: jpg o png
const configuracionMulter = {
    storage : filestorage = multer.diskStorage({
        destination : (req, res, cb) => {
            cb(null, __dirname + '/../uploads/');
        },
        filename : (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            console.log('Extensión: ', extension);
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter : (req, file, cb) => {
        if( file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'));
        }
    }
}

// Pasamos la configuración y el campo para ejecutar Multer
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            res.json({ mensaje : error});
        }
        return next();
    });
}

// Crea un nuevo producto
exports.nuevoProducto = async (req, res, next) => {
    const producto = new Productos(req.body);

    try{
        if(req.file){
            producto.imagen = req.file.filename;
        }
        await producto.save();
        res.json({mensaje: 'Se agregó un nuevo producto'});
    } catch (err){
        console.log(err);
        next();
    }
}

// Muestra todos los productos
exports.mostrarProductos = async (req, res, next) => {
    try {
        // Obtener todos los productos
        const productos = await Productos.find();
        res.json(productos);
    } catch (error) {
        console.log(error);
        next();
    }
}

// Muestra un producto por id
exports.mostrarProducto = async (req, res, next) => {
    const producto = await Productos.findById(req.params.id);

    if(!producto){
        res.json({mensaje : 'Ese producto no existe'});
        return next();
    }

    // Mostrar el producto
    res.json(producto);
}

// Actualizar un producto por id
exports.actualizarProducto = async (req, res, next) => {
    try {
        let nuevoProducto = req.body;
        
        // Verificar si hay imagen nueva
        // nuevoProducto.imagen = (req.file ? req.file.filename : productoAnterior.imagen); // Se comenta y para hacer la consulta a la BD sólo en el caso de que no exista un archivo nuevo
        if (req.file){
            nuevoProducto.imagen = req.file.filename;
        } else {
            let productoAnterior = await Productos.findById(req.params.id);
            nuevoProducto.imagen = productoAnterior.imagen
        }

        let producto = await Productos.findOneAndUpdate({_id : req.params.id} , nuevoProducto, { new : true});
        res.json(producto);
    } catch (error) {
        console.log(error);
        next();
    }
}

// Eliminar un producto por ID
exports.eliminarProducto = async(req, res, next) => {
    try {
        const producto = await Productos.findById(req.params.id);

        if(producto.imagen){

            const path = __dirname + '/../uploads/' + producto.imagen;
            fs.unlink( path , (err) => {
                if(err){
                    console.log(err);
                } else {
                    console.log('El archivo fue eliminado correctamente');
                }
            });

        }
        await Productos.findOneAndDelete({_id : req.params.id});
        res.json({mensaje : 'El producto se ha eliminado.'})
    } catch (error) {
        console.log(error);
        next();
    }
}


// Buscar productos en la BD
exports.buscarProductos = async (req, res, next) => {

    try {
        
        // Obtener el query
        const {query} = req.params;
        const producto = await Productos.find({nombre: new RegExp(query, 'i')});
        res.json(producto);

    } catch (error) {
        console.log(error);
        next();
    }

}