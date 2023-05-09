import { Router } from "express";
import { auth } from "../middleware/middlewares.js";
import contenedorProductos from "../controllers/contenedorProductos.js";

const indexRouter = Router();

let info = {
    _1: {
      title: "Argumento de Entradas",
      description: process.argv,
    },
    _2: {
      title: "Sistema Operativo",
      description: process.platform,
    },
    _3: {
      title: "Version Node JS",
      description: process.version,
    },
    _4: {
      title: "Memoria Total Reservada(rss)",
      description: process.memoryUsage().rss,
    },
    _5: {
      title: "Path de Ejecucion",
      description: process.execPath,
    },
    _6: {
      title: "Process Id",
      description: process.pid,
    },
    _7: {
      title: "Carpeta del Proyecto",
      description: process.cwd(),
    },
  };
  

indexRouter.get("/", auth, contenedorProductos.getAll);

// Entrega con Process
indexRouter.get("/info", (req, res) => {    
    res.render("pages/info", { info: info });
  });

export default indexRouter;
