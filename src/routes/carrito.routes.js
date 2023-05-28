import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import cartController from '../controllers/contenedorCarrito.js'
import { addLogger } from "../middleware/logger.middleware.js";

const carritosRouter = Router();

carritosRouter
    .get("/", addLogger, auth, cartController.getById)    
    .post("/", addLogger, auth, cartController.create)
    .post("/:id_cart/productos/:id_prod", addLogger, auth, cartController.addProductCart)
    .post("/:id_cart/productos/:id_prod/delete", addLogger, auth, cartController.deleteProductCart)
    .post("/:id_cart/productos/:id_prod/increment", addLogger, auth, cartController.incrementProductCart)
    .post("/:id_cart/productos/:id_prod/decrement", addLogger, auth, cartController.decrementProductCart);
        
export default carritosRouter;
