import { Router } from "express";
import hProduct from "../handler/hProduct.js";
const route = Router();

route.get(`/:pid`, (req,res)=>{
  hProduct.get(req,res);
}); 

route.get(`/`, (req,res)=>{
  hProduct.getAll(req,res);
});

route.post(`/`, (req, res)=>{
  hProduct.add(req,res);

});

route.put(`/:pid`, (req,res)=>{
  hProduct.update(req,res);
}); 

route.delete(`/:pid`, (req, res)=>{
  hProduct.delete(req,res);
})

export default route


