import { Router } from "express";
import passport from "passport";
import { msgFlash } from "../../middleware/middlewares.js";
import { addLogger } from "../../middleware/logger.middleware.js";
import uploader from "../../middleware/multer.middleware.js"
import usersController from "../../controllers/contenedorUser.js"

const userRouter = Router();

userRouter
    .get('/login', addLogger, msgFlash, usersController.renderLogin)
    .get('/register', addLogger, msgFlash, usersController.renderRegister)
    .post('/register', 
        uploader.single('file'), 
        passport.authenticate("register", {
            failureRedirect: "/api/auth/register",
            successRedirect: "/",
            failureFlash: true,
          }),
        addLogger, 
        (req,res) => { }
    )
    .post('/login',
        passport.authenticate('login', {
            failureRedirect:'/api/auth/loginFail',
            successRedirect: "/",
            failureMessage:true,
        }), 
        addLogger, 
        async (req,res)=>{
            const user = req.user; 
            req.session.user = {
                id: user._id,
                email:user.email,
                role:user.role
            }
        res.redirect("/")
        }
    )

    .get('/loginFail',addLogger,(req,res)=>{
        console.log(req.session.messages);        
        res.status(400).send({status:"error",error:"Error de autenticación"})
    })

    .get("/logout", addLogger, (req, res) => {    
        req.logout((error) => {
            if (error) return res.send({message: "Error al Logout"});
            req.flash("success", "Cerraste Sesion con Exito");
            req.session.destroy();
            res.redirect("/");
        });
    });


export default userRouter;