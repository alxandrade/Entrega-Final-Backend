import passport from "passport";
import local from "passport-local";
import { loadEmail } from "../utils/nodemailer.js";
import { cartService } from "../services/index.service.js";
import { createHash, isValid } from "../utils/bcrypt.js";
import { userSchema } from "../models/modeloUserPassport.js";

const LocalStrategy = local.Strategy;

export const initializePassport = () => {

  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField:'email' }, async (req, email, password, done) => {      
      const { first_name, last_name } = req.body;      
      const file = req.file;
      
      
      if(!file) return done(null, false, {status:"error",error:"Error al cargar el archivo"});
      if(!first_name||!email||!password) return done(null,false,{status:"error",error:"Valores incompletos"});
        
      const exists  = await userSchema.findOne({email});
      if(exists) return done(null,false, {status:"error",error:"El usuario ya existe"});
      const hashedPassword = await createHash(password);

      /* crear un carrito y que me devuelva el id para ponerselo al usuario y registrarlo */
      let cart_id = await cartService.save({ email: email, first_name: first_name });
      const newUser = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        avatar: `${req.protocol}://${req.hostname}:${process.env.PORT}/img/${file.filename}`,
        cart_id: cart_id._id,
      };
      
      let result = await userSchema.create(newUser);
      if (result) loadEmail(newUser);
      return done(null, result);      
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy({usernameField:'email'}, async (email, password, done) => {
      try {        
        let user = await userSchema.findOne({ email });
        console.log(user)
        if (!user) return done(null, false, { message: "No existe usuario regitrado con ese Email" });
        const isValidPassword = await isValid(user.password, password);
        if (!isValidPassword) return done(null, false, { message: "Contraseña incorrecta" });
        return done(null, user);
      } catch (error) {
        done(error);
      }            
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    userSchema.findById(id, done);
  });

  
};
