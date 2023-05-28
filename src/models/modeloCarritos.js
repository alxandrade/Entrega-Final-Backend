import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Cart {
  static get model() {
    return "carritos";
  }

  static get schema() {
    return{
      email: { type: String, require: true },
      first_name: String,
      products: { type: Array, require: false },
    };
  }
}