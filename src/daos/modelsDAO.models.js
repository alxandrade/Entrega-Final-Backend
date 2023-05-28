import loggerApp from "../utils/logger.utils.js";
import mongoose from "mongoose";
import User from "../models/modeloUser.js";
import Productos from "../models/modeloProductos.js";
import Cart from "../models/modeloCarritos.js";
import Order from "../models/modeloOrden.js";

mongoose.set("strictQuery", false);

export default class ModelsMongoDAO {
  constructor(config) {    
    this.mongoose = mongoose
      .connect(config, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => {
        loggerApp.error(error);
        process.exit();
      });

    const userSchema = mongoose.Schema(User.schema);
    const productSchema = mongoose.Schema(Productos.schema);
    const cartSchema = mongoose.Schema(Cart.schema);
    const orderSchema = mongoose.Schema(Order.schema);

    this.models = {
      [User.model]: mongoose.model(User.model, userSchema),
      [Productos.model]: mongoose.model(Productos.model, productSchema),
      [Cart.model]: mongoose.model(Cart.model, cartSchema),
      [Order.model]: mongoose.model(Order.model, orderSchema),
    };
  }

  get = async (options, entity) => {
    if (!this.models[entity]) throw new Error("Entity not found in models");
    let results = await this.models[entity].find(options).lean();
    return results;
  };

  getById = async (options, entity) => {
    let result = await this.models[entity].findOne({ _id: options }).lean();
    return result;
  };

  create = async (document, entity) => {    
    let results = await this.models[entity].create(document);
    return results;
  };

  saveProducto = async (document, entity) => {        
    try{
      const results = await this.models[entity].create(document);            
      return results;
    }catch(error){
      loggerApp.error(error);
    }
  }

  delete = async (params, entity) => {
    let result = await this.models[entity].deleteOne({ _id: params });
    return result;
  };

  update = async (id, body, entity) => {
    let result = await this.models[entity].updateOne({ _id: id }, body);
    return result;
  };

  deleteAll = async (id_cart, entity) => {
    try {
      await this.models[entity].findByIdAndUpdate(id_cart, { products: [] });
      return;
    } catch (error) {
      loggerApp.error(error);
    }
  };

  createProductInCart = async (id, document, entity) => {
    if (id) {
      try {
        let list = [];
        const dataObj = await this.models[entity].findOne({ _id: id }).lean();
        const product = await this.models[entity].findOne({ _id: id, "products._id": document._id });
        if (product) {
          let quantity = product.products[0].cantidad + 1;
          return await this.models[entity].updateOne(
            { _id: id },
            { $set: { "products.$[elemX].cantidad": quantity } },
            { arrayFilters: [{ "elemX._id": document._id }] }
          );
        }
        list.push(...dataObj.products);
        list.push({ ...document, cantidad: 1 });
        return this.models[entity].updateOne({ _id: id }, { products: list });
      } catch (error) {
        loggerApp.error(error);
      }
    }
  };

  incrementProductCart = async (id, document, entity) => {    
    const cart = await this.models[entity].findOne({ _id: id }).populate('products');       
    const product = cart.products.find(product => product._id.toString() === document._id.toString());
    if (product) {            
      let cantidad = product.cantidad + 1;
      return await this.models[entity].updateOne(
        { _id: id },
        { $set: { "products.$[elemX].cantidad": cantidad } },
        { arrayFilters: [{ "elemX._id": document._id }] }
      );
    }
  };

  decrementProductCart = async (id, document, entity) => {
    const cart = await this.models[entity].findOne({ _id: id }).populate('products');       
    const product = cart.products.find(product => product._id.toString() === document._id.toString());
    if (product) {      
      let cantidad = product.cantidad - 1;
      if (cantidad === 0) {
        return await this.models[entity].updateOne({ _id: id }, { $pull: { products: { _id: document._id } } });
      }
      return await this.models[entity].updateOne(
        { _id: id },
        { $set: { "products.$[elemX].cantidad": cantidad } },
        { arrayFilters: [{ "elemX._id": document._id }] }
      );
    }
  };


  deleteProductInCart = async (id_cart, id_prod, entity) => {
    try {
      let list = [];
      let newList = [];
      console.log("DELETE")
      const dataObj = await this.models[entity].findOne({ _id: id_cart }).lean();
      list.push(...dataObj.products);
      for (let i = 0; i <= list.length - 1; i++) {
        console.log(list[i]._id.toString())
        if (list[i]._id.toString() != id_prod) {
          newList.push(list[i]);
        }
      }
      return this.models[entity].updateOne({ _id: id_cart }, { products: newList });
    } catch (error) {
      loggerApp.error(error);
    }
  };

  createOrder = async (params, products, total, entity) => {
    try {
      const order = await this.models[entity].create({
        name: params.user.name,
        email: params.user.username,
        products: products.products,
        total: total,
      });
      return order;
    } catch (error) {
      loggerApp.error(error);
    }
  };
}
