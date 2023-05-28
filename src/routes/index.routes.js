import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import productsController from '../controllers/contenedorProductos.js'
import { addLogger } from "../middleware/logger.middleware.js";

const indexRouter = Router();

indexRouter.get("/", addLogger, auth, productsController.getAll);

export default indexRouter;
