import { productService } from "../services/index.service.js";
import loggerApp from '../utils/logger.utils.js'

const getAll = async (req, res) => {
  try {
    const products = await productService.get();
    res.render("pages/home", { userLogin: req.user.email, products, idCart: req.user.cart_id });
  } catch (error) {
    loggerApp.error (error);
  }
};

const getById = async (req, res) => {
  let { id } = req.params;
  let result = await productService.getById(id);
  res.send(result);
};

const renderCreate = async (req, res) => {
  res.render("pages/create-product");
};

const create = async (req, res) => {
  let { codigo, descripcion, precio, stock, foto } = req.body;
   
  try {    
    if ((!codigo, !descripcion, !foto)) return res.status(400).send({ message: "Todos los campos son requeridos" });
    let obj = req.body;    
    let productos = await productService.saveProducto(obj);
    res.status(201);
    res.render("pages/create-product", { productos: productos });    
    } catch (error) {
      res.status(400).send(error);
      loggerApp.error(error.message);    
  } 
};

const deleteById = async (req, res) => {
  let { id } = req.params;
  let result = await productService.delete(id);
  res.send(result);
};

const deleteAll = (req, res) => {};

const updateById = async (req, res) => {
  let { id } = req.params;
  let { body } = req;
  let result = await productService.update(id, body);
  res.send(result);
};

export default { getAll, getById, renderCreate, create, deleteById, deleteAll, updateById };

