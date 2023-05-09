import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import orderController from "../controllers/contenedorOrden.js";


const orderRouter = Router();

orderRouter 
  .get('/:id', auth, orderController.getById)
  .get("/:id", auth, orderController.getById)
  .post('/:idCart', auth, orderController.create)

export default orderRouter;