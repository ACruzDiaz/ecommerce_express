import { Router } from "express";
import hCart from "../handler/hCart.js"
const route = Router();

const PATH = '/api/carts'
route.get(`${PATH}/:cid`, (req,res)=>{
  const cart = new hCart(req,res);
  cart.get();
}); //get ONE item
route.post(`${PATH}/:cid/product/:pid`, (req, res)=>{
  const cart = new hCart(req,res);
  cart.add();
}); //add ONE item
route.post(`${PATH}`, (req,res)=>{
  const cart = new hCart(req,res);
  cart.create();
}); // crear el carrito

export default route
