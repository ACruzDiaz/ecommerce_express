import { Router } from "express";
const route = Router();
import hb from "../helpers/useHandlebars.js";
import mProduct from "../model/mProduct.js";

route.get('/realTimeProducts', async(req,res)=>{
  try {
    hb.regPartial('src/handlebars/layout.handlebars');
    const template = hb.getTemplate('src/handlebars/realTimeProducts.handlebars');

    const productModel = new mProduct();
    const allProducts = await productModel.getAll();

    var context = {
      allProducts,
      file: 'realTimeProd.css',
      title: 'Hola Alan',
    };
  
    var salida = template(context);
    res.send(salida);
  } catch (error) {
    console.log(error);
  }
})
export default route;