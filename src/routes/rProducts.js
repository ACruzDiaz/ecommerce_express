import { Router } from "express";
import hProduct from "../handler/hProduct.js";
const route = Router();


route.get(`/:pid`, (req,res)=>{
  const product = new hProduct(req,res);
  product.get();
}); 

route.get(`/`, (req,res)=>{
  const product = new hProduct(req,res);
  product.getAll();
});

route.post(`/`, (req, res)=>{
  const product = new hProduct(req,res);
  product.add();

});

route.put(`/:pid`, (req,res)=>{
  const product = new hProduct(req,res);
  product.update();
}); 

route.delete(`/:pid`, (req, res)=>{
  const product = new hProduct(req,res);
  product.delete();
})

export default route


