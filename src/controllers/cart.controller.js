const Cart = require("../models/cart");
const Product = require("../models/product");


// crear carrito
const createCart = async (req, res) => {
  try {
    const nuevoCarrito = await Cart.create({ productos: [] });
    res.json(nuevoCarrito);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
};


// obtener carrito
const getCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const carrito = await Cart.findById(cid).populate("productos.producto");

    //res.render("cart", { carrito: carrito.toObject() });
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: "Carrito no encontrado" });
  }
};


// agregar producto al carrito
const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const carrito = await Cart.findById(cid);

    const producto = await Product.findById(pid);
    if (!producto) return res.status(404).json({ error: "Producto no existe" });

    // buscar si ya está
    const index = carrito.productos.findIndex(
      p => p.producto.toString() === pid
    );

    if (index !== -1) {
      carrito.productos[index].cantidad += 1;
    } else {
      carrito.productos.push({ producto: pid, cantidad: 1 });
    }

    await carrito.save();

    res.json({ status: "Producto agregado al carrito" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
};

module.exports = {
  createCart,
  getCart,
  addProductToCart
};
