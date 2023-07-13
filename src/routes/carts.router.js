import { Router } from 'express';
const carts = Router();

// Carts manager
import CartsManager from '../dao/fileManagers/carts.manager.js';
const cartsManager = new CartsManager('carts');

// Endpoint para agregar un carrito:
carts.post('/', async (req, res) => {
  try {
    const postResponse = cartsManager.addCart();
    return res.status(200).send(postResponse);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// carrito por ID
carts.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cartId = parseInt(cid);

    const cart = await cartsManager.getCartById(cartId);
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// AGREGAR AL CARRITO
carts.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartId = parseInt(cid);
    const productId = parseInt(pid);
    cartsManager.addProductToCart(cartId, productId);

    const cart = await cartsManager.getCartById(cartId);
    return res.status(200).json(cart);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// BORRAR CARRITO
carts.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cartId = parseInt(cid);

    const deleteResponse = cartsManager.deleteCart(cartId);
    return res.status(200).send(deleteResponse);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default carts;
