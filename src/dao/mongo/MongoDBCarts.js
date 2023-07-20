import MongoClass from "./MongoClass.js";
import { cartsSchema } from "./models/CartsSchema.js";

export class MongoDBCarts extends MongoClass {
  constructor() {
    super("carts", cartsSchema);
  }

  getAll = async () => {
    const carritos = await this.baseModel.find({}).populate({
      path: "products",
      populate: { path: "_id", model: "products" },
    });
    return carritos;
  };

  getOne = async (id) => {
    try {
      const one = await this.baseModel.findById(id).populate({
        path: "products",
        populate: { path: "_id", model: "products" },
      });
      return one;
    } catch (err) {
      throw new Error(err);
    }
  };

  addProduct = async (cart, product) => {
    const { products } = cart;
    const productExists = products.find((p) => p._id._id.equals(product._id));
    if (productExists) {
      productExists.quantity++;
    } else {
      products.push({ _id: product._id, quantity: 1 });
    }
    return this.baseModel.findByIdAndUpdate(cart._id, { products });
  };

  addManyOfTheSameProduct = async (cart, product, quantity) => {
    const { products } = cart;
    const productExists = products.find((p) => p._id._id.equals(product._id));
    if (productExists) {
      productExists.quantity = quantity;
    } else {
      products.push({ _id: product._id, quantity });
    }
    return this.baseModel.findByIdAndUpdate(cart._id, { products });
  };

  removeProduct = async (cart, product) => {
    const { products } = cart;
    if (products.length === 0) {
      throw new Error("El carrito está vacío");
    }
    const productExists = products.find((p) => p._id._id.equals(product._id));
    if (productExists) {
      productExists.quantity > 1
        ? (productExists.quantity -= 1)
        : (cart.products = products.filter(
            (p) => !p._id._id.equals(product._id)
          ));
    } else {
      throw new Error("El producto no está en el carrito");
    }
    return this.baseModel.findByIdAndUpdate(cart._id, { products });
  };

  emptyCart = async (cart) => {
    return this.baseModel.findByIdAndUpdate(cart._id, { products: [] });
  };

  updateProductsOfOneCart = async (cart, products) => {
    return this.baseModel.findByIdAndUpdate(cart._id, { products });
  };
}
