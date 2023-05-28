import express from "express";
import cluster from "cluster";
import os from 'os';
import cors from "cors";
import msgFlash from "connect-flash";
import http from "http";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import userRouter from './routes/auth/sessions.routes.js';
import { initializePassport } from "./strategies/passport.strategy.js";
import passport from "passport";
import indexRouter from "./routes/index.routes.js";
import compression from 'express-compression';
import { addLogger } from "./middleware/logger.middleware.js";
import productsRouter from "./routes/producto.routes.js";
import cartRouter from "./routes/carrito.routes.js";
import profileRouter from "./routes/profile.routes.js";
import orderRouter from "./routes/order.routes.js";
import dotenv from 'dotenv'

dotenv.config();


const app = express();
const CPUs = os.cpus().length;
const PORT = process.env.PORT || 8080;

// Servidores
const httpServer = http.createServer(app);

// Middlewares
app.use(compression());
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(msgFlash());
app.use(express.urlencoded({extended:true}));

// Logger
app.use(addLogger);

app.use(session({
    store: MongoStore.create({mongoUrl: process.env.MONGO_URL}),
    key: process.env.MONGO_STORE_KEY,
    secret: process.env.MONGO_STORE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge:600000, //10 min
    },
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.engine('hbs',handlebars.engine({extname:".hbs"}));
app.set('views', `${__dirname}/views`);
app.set('view engine','hbs');


// Metodo GET para Loggeo
app.use('/api/auth',userRouter);

// Para Productos y Carrito
app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);

// Para ver el Profile de quien esta conectado 
app.use("/api/profile", profileRouter);

app.use("/", indexRouter);

// Para las Ordenes de Compra
app.use("/api/order", orderRouter);

app.use((req, res) => {
    console.log(`ruta ${req.baseUrl} ${req.url} metodo ${req.method} no implementada`);
    res
      .status(404)
      .render("pages/404", { error: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada` });
  });

/*if(cluster.isPrimary){
    console.log(`Proceso primario (o padre) en PID: ${process.pid}. Generando procesos Hijos`)
    for(let i = 0; i < CPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit',(worker)=>{
        console.log(`Proceso hijo con pid ${worker.process.pid} Murió :(, creando reemplazo`)
        cluster.fork();
    })
}else{
    console.log(`Proceso worker (o hijo) en PID: ${process.pid}`)
    httpServer.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));
}*/

httpServer.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));
