import fs from "fs";
import ProductManager from "./productManager.js";

const pathToCarts = "src/dao/carts.json";
const productManager = new ProductManager();

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async addCart() {
    const allCarts = await this.read();
    const nextId = this.getNextId(allCarts);
    const newCart = {
      id: nextId,
      products: [],
    };
    allCarts.push(newCart);
    await this.write(allCarts);
    return newCart;
  }

  async addProductToCart(cartId, productId) {
    const allCarts = await this.read();
    const cartToUpdate = allCarts.find((cart) => cart.id === cartId);

    if (!cartToUpdate) {
      return {
        status: "error404",
        message: "No se encontró: " + cartId,
        payload: {},
      };
    }

    const allProducts = await productManager.read();
    const productToAdd = allProducts.find((product) => product.id === productId);

    if (!productToAdd) {
      return {
        status: "error404",
        message: "No se encontró: " + productId,
        payload: {},
      };
    }

    const productAlreadyInCart = this.findProductInCart(cartToUpdate, productId);

    if (productAlreadyInCart) {
      productAlreadyInCart.quantity++;
    } else {
      cartToUpdate.products.push({ id: productToAdd.id, quantity: 1 });
    }

    await this.write(allCarts);
    return cartToUpdate;
  }

  findProductInCart(cartToUpdate, productId) {
    return cartToUpdate.products.find((product) => product.id === productId);
  }

  async read() {
    try {
      const allCartsString = await fs.promises.readFile(this.path, "utf-8");
      return allCartsString.length > 0 ? JSON.parse(allCartsString) : [];
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
      return [];
    }
  }

  async write(allCarts) {
    const allCartsString = JSON.stringify(allCarts);
    try {
      await fs.promises.writeFile(this.path, allCartsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }

  getNextId(allCarts) {
    const allIdsArray = allCarts.map((cart) => cart.id);
    const numericIds = allIdsArray.filter((id) => typeof id === "number");
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  }
}

export default CartManager;