import fs from "fs";
import ProductManager from "./productManager.js";

class CartDatabase {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager(pathProducts);
  }

  addCart = async () => {
    const allCartsArray = await this.read();
    const nextId = await this.getNextId(allCartsArray);
    const newCart = {
      id: nextId,
      products: [],
    };
    allCartsArray.push(newCart);
    await this.write(allCartsArray);
    return newCart;
  };

  addProductToCart = async (idCart, idProduct) => {
    const allCartsArray = await this.read();
    const cartToUpdate = allCartsArray.find((cart) => cart.id === idCart);

    if (!cartToUpdate) {
      return {
        status: "error",
        message: "No se encontró el id: " + idCart,
        payload: {},
      };
    }

    const allProductsArray = await this.productManager.read();
    const productToAdd = allProductsArray.find((product) => product.id === idProduct);

    if (!productToAdd) {
      return {
        status: "error",
        message: "no se encontró el producto: " + idProduct,
        payload: {},
      };
    }

    const productAlreadyInCart = await this.findProductInCart(cartToUpdate, idProduct);

    if (productAlreadyInCart) {
      const index = cartToUpdate.products.indexOf(productAlreadyInCart);
      const productData = {
        id: productAlreadyInCart.id,
        quantity: productAlreadyInCart.quantity + 1,
      };
      cartToUpdate.products[index] = productData;
    } else {
      const productData = {
        id: productToAdd.id,
        quantity: 1,
      };
      cartToUpdate.products.push(productData);
    }

    const index = allCartsArray.indexOf(cartToUpdate);
    allCartsArray[index] = cartToUpdate;
    await this.write(allCartsArray);
    return cartToUpdate;
  };

  findProductInCart = (cartToUpdate, idProduct) => {
    return cartToUpdate.products.find((product) => product.id === idProduct);
  };

  read = async () => {
    try {
      const allCartsString = await fs.promises.readFile(this.path, "utf-8");
      return allCartsString.length > 0 ? JSON.parse(allCartsString) : [];
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
      return [];
    }
  };

  write = async (allCartsArray) => {
    const allCartsString = JSON.stringify(allCartsArray);
    try {
      await fs.promises.writeFile(this.path, allCartsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  };

  getNextId = (allCartsArray) => {
    const allIdsArray = allCartsArray.map((product) => product.id);
    const numericIds = allIdsArray.filter((id) => typeof id === "number");
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  };
}

export default CartDatabase;