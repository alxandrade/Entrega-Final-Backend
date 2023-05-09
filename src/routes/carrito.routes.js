import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import cartController from '../controllers/contenedorCarrito.js'

const carritosRouter = Router();

carritosRouter
    .get("/", auth, cartController.getById)    
    .post("/", auth, cartController.create)
    .post("/:id_cart/productos/:id_prod", auth, cartController.addProductCart)
    .post("/:id_cart/productos/:id_prod/delete", auth, cartController.deleteProductCart)
    .post("/:id_cart/productos/:id_prod/increment", auth, cartController.incrementProductCart)
    .post("/:id_cart/productos/:id_prod/decrement", auth, cartController.decrementProductCart);
        
export default carritosRouter;
