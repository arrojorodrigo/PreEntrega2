import mongoose from "mongoose";

class MongoClass {
  constructor(collectionName, docSchema) {
    this.baseModel = mongoose.model(collectionName, docSchema);
  }

  getAll = async () => {
    try {
      const all = await this.baseModel.find({});
      return all;
    } catch (err) {
      throw new Error(err);
    }
  };

  getOne = async (id) => {
    try {
      const one = await this.baseModel.findById(id);
      return one;
    } catch (err) {
      throw new Error(err);
    }
  };

  create = async (doc) => {
    console.log(doc);
    try {
      const newDoc = await this.baseModel.create(doc);
      return newDoc;
    } catch (err) {
      throw new Error(err);
    }
  };

  update = async (id, doc) => {
    try {
      await this.baseModel.findByIdAndUpdate(id, doc);
      const docUpdated = await this.baseModel.findById(id);
      return docUpdated;
    } catch (err) {
      throw new Error(err);
    }
  };

  delete = async (id) => {
    try {
      const deletedDoc = await this.baseModel.findByIdAndDelete(id);
      return deletedDoc;
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default MongoClass;