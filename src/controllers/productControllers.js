import { MongoDBProducts } from "../../dao/mongo/MongoDBProducts.js";

const db = new MongoDBProducts();

const oneProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const product = await db.getOne(id);
      product
        ? res.status(200).json({
            status: "success",
            payload: product,
          })
        : res.status(404).json({
            status: "error404",
            message: "no se encontró: " + id,
            payload: {},
          });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  };

  const allProducts = async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;
      console.log(limit, page, sort, query);
      const products = await db.getAll(limit, page, sort, query);
      products
        ? res.status(200).json({
            status: "success",
            payload: products,
          })
        : res.status(200).json({ status: "success", payload: [] });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  };

  const createProduct = async (req, res) => {
    try {
      const newProduct = req.body;
      const response = await db.getAll();
      const allProducts = response.docs;
      const product = allProducts.find(
        (product) => product.code == newProduct.code
      );
      if (product) {
        res.status(400).json({
          status: "error",
          payload:
            "Invalid request body. Code already exists: " + newProduct.code,
        });
        return;
      }
      const productCreated = await db.create(newProduct);
      console.log(productCreated);
      res.status(201).json({
        status: "success",
        payload: productCreated,
      });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  };

const updateProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const newProduct = req.body;
      const productUpdated = await db.update(id, newProduct);
      res.status(200).json({
        status: "success",
        payload: productUpdated,
      });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  };


const deleteProduct = async (req, res) => {
    try {
      const id = req.params.id;
      const productDeleted = await db.delete(id);
      res.status(200).json({
        status: "success",
        payload: productDeleted,
      });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  }


export {deleteProduct, updateProduct, createProduct, allProducts, oneProduct}





