import MongoClass from "./MongoClass.js";
import { productsSchema } from "./models/ProductsSchema.js";

export class MongoDBProducts extends MongoClass {
  constructor() {
    super("products", productsSchema);
  }

  getAll = async ({ limit = 10, page = 1, sort = {}, query = {} }) => {
    const filter = query.title
      ? { title: { $regex: query.title, $options: "i" } }
      : {};
    const all = await this.baseModel.paginate(filter, {
      limit,
      page,
      sort,
      lean: true,
    });
    return all;
  };
}

export default MongoDBProducts;
