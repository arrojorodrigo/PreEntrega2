import productsModel from '../models/products.model.js';

export default class ProductManagerDb {
  getProductById = async (id) => {
    return await productsModel.findOne({ id: id }).lean();
  };
  getAllProducts = async () => {
    return await productsModel.find().lean();
  };

  saveProduct = async (product) => {
    console.log('products', product);
    return await productsModel.create(product);
  };
}
