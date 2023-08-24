import ProductManager from "../dao/fileManagers/products.manager.js"
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);

//verificar que title,description,code, price, stock y category existan en la request
const validateRequest = (req, res, next) => {
  const keysBody = Object.keys(req.body);
  console.log("keysBody", keysBody);
  
  const requiredKeys = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ];
  const isValidRequest = requiredKeys.every((key) => keysBody.includes(key));
  
  if (!isValidRequest) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request body. Missing Fields",
    });
    return;
  }
  next();
};


//valida que la propiedad code no se repita
const validateCodeNotRepeated = async (req, res, next) => {
  const { code } = req.body;
  const allProducts = await myProductManager.getProducts();

  const product = allProducts.find((product) => product.code == code);
  if (product) {
    res.status(400).json({
      status: "error",
      payload: "Invalid request body. Code already exists: " + code,
    });
    return;
  }
  next();
};


//valida que el dato del params sea de tipo "string"
const validateNumberParams = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    res.status(400).json({
      status: "error",
      payload: "Invalid id: " + id,
    });
    return;
  }
  next();
};

export { validateRequest, validateNumberParams, validateCodeNotRepeated };
