import { Router } from "express";
import hCart from "../handler/hCart.js"
const router = Router({caseSensitive:true});

router.get(`/:cid`, (req,res)=>{
  hCart.get(req,res);
}); 
router.post(`/:cid/product/:pid`, (req, res)=>{
  hCart.add(req,res);
}); 
router.post('/',(req,res)=>{
  hCart.create(req,res);
}); 
router.put('/:cid', (req,res)=>{
  hCart.updateManyProducts(req,res); 
})
router.delete('/:cid/products/:pid', (req,res)=>{
  hCart.deleteOneProduct(req,res);
})
router.delete('/:cid', (req,res) => {
  hCart.deleteAll(req,res);
})
export default router
