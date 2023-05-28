import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import { addLogger } from "../middleware/logger.middleware.js";
import contenedorUser from "../controllers/contenedorUser.js";

const profileRouter = Router();

profileRouter.get("/", addLogger, auth, contenedorUser.getUser);

export default profileRouter;
