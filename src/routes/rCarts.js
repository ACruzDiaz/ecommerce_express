import { Router } from "express";
import hCart from "../handler/hCart.js"
const router = Router({caseSensitive:true});

router.get(`/:cid`, (req,res)=>{
  const cart = new hCart(req,res);
  cart.get();
}); //get ONE item
router.post(`/:cid/product/:pid`, (req, res)=>{
  const cart = new hCart(req,res);
  cart.add();
}); //add ONE item
router.post('/',(req,res)=>{
  const cart = new hCart(req,res);
  cart.create();
}); // crear el carrito
router.put('/:cid', (req,res)=>{
  const cart = new hCart(req,res)
  cart.updateManyProducts()
})
router.delete('/:cid/products/:pid', (req,res)=>{
  const cart = new hCart(req,res);
  cart.deleteOneProduct()
})
router.delete('/:cid', (req,res) => {
  const cart = new hCart(req,res)
  cart.deleteAll();
})
export default router
