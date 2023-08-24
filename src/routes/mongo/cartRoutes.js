import { Router } from "express";
const router = Router();
import { MongoDBCarts } from "../../dao/mongo/MongoDBCarts.js";
import { MongoDBProducts } from "../../dao/mongo/MongoDBProducts.js";
import { createCart, deleteCart, deleteIdCart, getCart, getIdCart, getProduct, putIdProduct, putProduct } from "../../controllers/cartControllers.js";

const cartsDAO = new MongoDBCarts();
const productsDAO = new MongoDBProducts();

router.post("/", createCart);

router.get("/", getCart);

router.get("/:idCart/products", getProduct);

router.get("/:idCart", getIdCart);

router.put("/:idCart/products/:idProduct", putProduct);

router.put("/:idCart", putIdProduct);

router.delete("/:idCart/products/:idProduct", deleteCart);

router.delete("/:idCart", deleteIdCart);

export default router;
