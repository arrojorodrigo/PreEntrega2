import { Router } from "express";
const router = Router();
import ProductDatabase from "../../daos/fs/productManager.js";
const path = "src/db/products.json";
const productDatabase = new ProductDatabase(path);
import { validateNumber } from "../../utils/helpers.js";

router.get("/", async (req, res) => {
  try {
    const products = await productDatabase.getProducts();
    const { limit } = req.query;
    const isValidLimit = validateNumber(limit);

    if (products) {
      const productsToShow = isValidLimit ? products.slice(0, limit) : products;
      res.render("home", {
        products: productsToShow,
      });
    } else {
      res.render("home", {
        products: [],
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;
