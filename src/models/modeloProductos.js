import mongoose from "mongoose";

let schema = mongoose.Schema;

export default class Productos {

  static get model() {
    return 'productos'
  }

  static get schema (){
    return {
      codigo: { type: String, required: true},
      descripcion: { type: String, required: true},
      precio: { type: Number, required: true},
      stock: { type: Number, required: true},
      foto: { type: String, required: true },
    };
  }
}

