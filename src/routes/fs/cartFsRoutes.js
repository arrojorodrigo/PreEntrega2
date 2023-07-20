import { Router } from "express";
const router = Router();
import CartDatabase from "../../daos/fs/cartManager.js";
const path = "./src/db/carts.json";
const cartDatabase = new CartDatabase(path);

router.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const cartCreated = await cartDatabase.addCart(newCart);
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
    const allCarts = await cartDatabase.read();
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
    const allCarts = await cartDatabase.read();
    const cart = allCarts.find((cart) => cart.id === idCart);
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

router.put("/:idCart/products/:idProduct", async (req, res) => {
  try {
    const { idCart, idProduct } = req.params;
    const cartUpdated = await cartDatabase.addProductToCart(idCart, idProduct);
    cartUpdated
      ? res.status(200).json({
          status: "success",
          payload: cartUpdated,
        })
      : res.status(404).json({
          status: "error",
          message: "Sorry, could not add product to cart",
          payload: {},
        });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
