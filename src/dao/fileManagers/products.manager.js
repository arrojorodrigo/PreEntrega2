import fs from "fs";

class ProductDatabase {
  constructor(path) {
    this.path = path;
  }

  getProducts = async () => this.read();

  getProductById = async (id) => {
    const allProductsArray = await this.read();
    return allProductsArray.find((product) => product.id === id);
  };

  addProduct = async (newProduct) => {
    const allProductsArray = await this.read();
    const nextId = await this.getNextId(allProductsArray);
    newProduct.id = nextId;
    newProduct.status = true;
    allProductsArray.push(newProduct);
    await this.write(allProductsArray);
    return newProduct;
  };

  updateProduct = async (id, newProduct) => {
    const allProductsArray = await this.read();
    const productToUpdate = allProductsArray.find((product) => product.id === id);

    if (!productToUpdate) {
      return {
        status: "error404",
        message: "no se encontró: " + id,
        payload: {},
      };
    }

    const updatedProduct = this.updateProductFields(productToUpdate, newProduct);
    const index = allProductsArray.indexOf(productToUpdate);
    allProductsArray[index] = updatedProduct;
    await this.write(allProductsArray);
    return updatedProduct;
  };

  deleteProduct = async (id) => {
    const allProductsArray = await this.read();
    const productToDelete = allProductsArray.find((product) => product.id === id);

    if (!productToDelete) {
      return {
        status: "error404",
        message: "no se encontró: " + id,
        payload: {},
      };
    }

    const index = allProductsArray.indexOf(productToDelete);
    allProductsArray.splice(index, 1);
    await this.write(allProductsArray);
    return productToDelete;
  };

  updateProductFields = (productToUpdate, newProduct) => ({
    ...productToUpdate,
    ...newProduct,
  });

  read = async () => {
    try {
      const allProductsString = await fs.promises.readFile(this.path, "utf-8");
      return allProductsString.length > 0 ? JSON.parse(allProductsString) : [];
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
      return [];
    }
  };

  write = async (allProductsArray) => {
    const allProductsString = JSON.stringify(allProductsArray);
    try {
      await fs.promises.writeFile(this.path, allProductsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  };

  getNextId = (allProductsArray) => {
    const allIdsArray = allProductsArray.map((product) => product.id);
    const numericIds = allIdsArray.filter((id) => typeof id === "number");
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  };
}

export default ProductDatabase;
