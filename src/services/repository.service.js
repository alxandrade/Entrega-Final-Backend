export default class Repository {
    constructor(dao, model) {
      this.dao = dao;
      this.model = model;
    }
  
    get = async (params) => {
      return this.dao.get(params, this.model);
    };
  
    getById = async (options) => {
      return this.dao.getById(options, this.model);
    };
  
    save = async (data) => {
      return this.dao.create(data, this.model);
    };

    saveProducto = async (data) => {
      return this.dao.saveProducto(data, this.model);
    };
    
  
    saveProductInCart = async (id, data) => {
      return this.dao.createProductInCart(id, data, this.model);
    };
  
    deleteProductInCart = async (id, data) => {
      return this.dao.deleteProductInCart(id, data, this.model);
    };
  
    incrementProductCart = async (id, data) => {
      return this.dao.incrementProductCart(id, data, this.model);
    };
  
    decrementProductCart = async (id, data) => {
      return this.dao.decrementProductCart(id, data, this.model);
    };
    
    delete = async (params) => {
      return this.dao.delete(params, this.model);
    };
  
    deleteAllProdToCart = async (params) => {
      return this.dao.deleteAll(params, this.model);
    };
  
    update = async (id, body) => {
      return this.dao.update(id, body, this.model);
    };
  
    createOrder = async (params, products, total) => {
      return this.dao.createOrder(params, products, total, this.model);
    };
  }
  