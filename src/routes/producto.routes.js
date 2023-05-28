import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import productController from '../controllers/contenedorProductos.js'
import { addLogger } from "../middleware/logger.middleware.js";

const productosRouter = Router();

productosRouter
  .get("/", addLogger, productController.getAll)
  .get("/nuevo", addLogger, productController.renderCreate)
  .get("/:id", addLogger, productController.getById)
  .post ("/", addLogger,  productController.create)
  .put("/:id", addLogger, productController.updateById)
  .delete ("/:id", addLogger, productController.deleteById)    
    
export default productosRouter;
