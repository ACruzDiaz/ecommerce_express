import { Router } from "express";
import hProduct from "../handler/hProduct.js"
const route = Router();

const PATH = '/api/products'
route.get(`${PATH}/:pid`, (req,res)=>{
  const product = new hProduct(req,res);
  product.get();
}); 

route.get(`${PATH}`, (req,res)=>{
  const product = new hProduct(req,res);
  product.getAll();
});

route.post(`${PATH}`, (req, res)=>{
  const product = new hProduct(req,res);
  product.add();
});
//Pendiente opcion para hacer update
route.put(`${PATH}/:pid`, (req,res)=>{
  const product = new hProduct(req,res);
  product.update();
}); 

route.delete(`${PATH}/:pid`, (req, res)=>{
  const product = new hProduct(req,res);
  product.delete();
})

export default route


