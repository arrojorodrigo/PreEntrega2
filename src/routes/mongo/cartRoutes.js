import { Router } from "express";
const router = Router();
import { MongoDBCarts } from "../../dao/mongo/MongoDBCarts.js";
import { MongoDBProducts } from "../../dao/mongo/MongoDBProducts.js";

const cartsDAO = new MongoDBCarts();
const productsDAO = new MongoDBProducts();

router.post("/", async (req, res) => {
  try {
    const cartCreated = await cartsDAO.create();
    cartCreated
      ? res.status(201).json({
          status: "success",
          payload: cartCreated,
        })
      : res.json({
          status: "error",
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const allCarts = await cartsDAO.getAll();
    allCarts
      ? res.status(200).json({
          status: "success",
          payload: allCarts,
        })
      : res.status(200).json({
          status: "success",
          payload: [],
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:idCart/products", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartsDAO.getOne(idCart);
    cart
      ? res.status(200).json({
          status: "success",
          payload: cart.products,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, no cart found by id: " + idCart,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartsDAO.getOne(idCart);
    const products = cart.products;
    cart
      ? res.render("myCart", { products })
      : res.status(404).json({
          status: "error",
          message: "Sorry, no cart found by id: " + idCart,
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.put("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const { idCart, idProduct } = req.params;
    const cart = await cartsDAO.getOne(idCart);
    const product = await productsDAO.getOne(idProduct);
    const { quantity } = req.body;

    if (quantity && !isNaN(quantity) && quantity > 0) {
      const cartUpdated = await cartsDAO.addManyOfTheSameProduct(
        cart,
        product,
        quantity
      );
      const response = await cartsDAO.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    } else {
      const cartUpdated = await cartsDAO.addProduct(cart, product);
      const response = await cartsDAO.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, line: err.line });
  }
});

router.put("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartsDAO.getOne(idCart);
    const { products } = req.body;

    if (cart) {
      const cartUpdated = await cartsDAO.updateProductsOfOneCart(
        cart,
        products
      );
      const response = await cartsDAO.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    } else {
      res.status(404).json({ message: "Missing data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, line: err.line });
  }
});

router.delete("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const { idCart, idProduct } = req.params;
    const cart = await cartsDAO.getOne(idCart);
    const product = await productsDAO.getOne(idProduct);

    if (cart && product) {
      const cartUpdated = await cartsDAO.removeProduct(cart, product);
      const response = await cartsDAO.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    } else {
      res.status(404).json({ message: "Missing data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, line: err.line });
  }
});

router.delete("/:idCart", async (req, res) => {
  try {
    const { idCart } = req.params;
    const cart = await cartsDAO.getOne(idCart);

    if (cart) {
      const cartUpdated = await cartsDAO.emptyCart(cart);
      const response = await cartsDAO.getOne(cartUpdated._id);
      res.status(201).json({
        status: "success",
        payload: response,
      });
    } else {
      res.status(404).json({ message: "Missing data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, line: err.line });
  }
});

export default router;
