import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import orderController from "../controllers/contenedorOrden.js";
import { addLogger } from "../middleware/logger.middleware.js";

const orderRouter = Router();

orderRouter 
  .get("/", addLogger, auth, orderController.getById)
  .get("/:id", addLogger, auth, orderController.getById)
  .post('/', addLogger, auth, orderController.create);
  
export default orderRouter;