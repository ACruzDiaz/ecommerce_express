import { Router } from "express";
const route = Router();
import vProducts from "../views/vProducts.js";

route.get('/realTimeProducts', (req,res)=>{
  
  vProducts.getRTProducts(req,res);
})

route.get('/products', (req,res)=>{
  vProducts.getProducts(req,res);
})
route.get('/carts/:cid', (req,res)=>{
  vProducts.getCart(req,res);
})

route.get('/products/:pid', (req,res)=>{
 vProducts.getOneProduct(req,res);
})

export default route;