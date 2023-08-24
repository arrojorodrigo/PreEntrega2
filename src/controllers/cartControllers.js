

const createCart = async (req, res) => {
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
};

const getCart = async (req, res) => {
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
  }

  const getProduct = async (req, res) => {
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
  }

const getIdCart = async (req, res) => {
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
  }

const putProduct = async (req, res) => {
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
  }

const putIdProduct = async (req, res) => {
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
  }

const deleteCart = async (req, res) => {
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
  }

const deleteIdCart = async (req, res) => {
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
  }

module.exports = { createCart,getCart,getProduct,getIdCart,putProduct,putIdProduct,deleteCart,deleteIdCart}