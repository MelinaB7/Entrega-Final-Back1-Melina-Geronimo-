const express = require("express");
const router = express.Router();

const {
  createCart,
  getCart,
  addProductToCart
} = require("../controllers/cart.controller");


// crear carrito
router.post("/", createCart);

// ver carrito
router.get("/:cid", getCart);

// agregar producto
router.post("/:cid/product/:pid", addProductToCart);

module.exports = router;
