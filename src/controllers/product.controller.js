const Product = require('../models/product');

// Obtener todos los productos y mostrar home
const getProductos = async (req, res) => {
  try {
    let productos = [];
    let counter = 0;

    let limit = req.query.limit ? Number(req.query.limit) : 10;
    let page = req.query.page ? Number(req.query.page) : 1;

    if (req.params.id) productos = [await Product.findById(req.params.id)];
    else {
      let findObj = {};
      if (req.query.categoria) findObj.categoria = req.query.categoria;
      //productos = await Product.find().lean();
      if (req.query.sort_price) {
        if (req.query.sort_price === 'asc') {
          productos = await Product.find(findObj).sort({ precio: 1 }).skip(page > 1 ? (page*limit)-limit : 0).limit(limit);
          counter = await Product.countDocuments(findObj);
        } else if (req.query.sort_price === 'dsc') {
          productos = await Product.find(findObj).sort({ precio: -1 }).skip(page > 1 ? (page*limit)-limit : 0).limit(limit);
          counter = await Product.countDocuments(findObj);
        } else {
          productos = await Product.find(findObj).skip(page > 1 ? (page*limit)-limit : 0).limit(limit);
          counter = await Product.countDocuments(findObj);
        }
      } else {
        productos = await Product.find(findObj).skip(page > 1 ? (page*limit)-limit : 0).limit(limit);
        counter = await Product.countDocuments(findObj);
      }
    }
    let totalPages = Math.ceil(counter / limit);
    let response = {
      status: 'success',
      payload: productos,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    };

    //res.render('home', { productos });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener los productos');
  }
};
// POST → agregar producto
const addProduct = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, cantidad } = req.body;

    await Product.create({
      nombre,
      descripcion,
      categoria,
      precio,
      cantidad
    });

    res.send('ok');
  } catch (error) {
    res.status(500).send('Error al agregar producto');
  }
};

// DELETE → eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    await Product.findByIdAndDelete(pid);

    res.send('ok');
  } catch (error) {
    res.status(500).send('Error al eliminar producto');
  }
};
module.exports = {
  getProductos,
  addProduct,
  deleteProduct
};
