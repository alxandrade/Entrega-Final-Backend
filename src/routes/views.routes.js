import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import contenedorProductos from "../controllers/contenedorProductos.js";

const viewsRouter = Router();

viewsRouter.get("/", auth, contenedorProductos.getAll);


/*viewsRouter.get("/", auth, async (req, res) => {
    res.render("pages/home", { userLogin: req.user.username });
})*/

export default viewsRouter;