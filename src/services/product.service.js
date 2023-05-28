import Productos from "../models/modeloProductos.js"
import Repository from "./repository.service.js";

export default class ProductService extends Repository {
  constructor(dao) {
    super(dao, Productos.model);
  }
}
