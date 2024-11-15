import { Router } from "express";
const route = Router();
import hb from "../helpers/useHandlebars.js";
import hProduct from "../handler/hProduct.js";

route.get('/realTimeProducts', async(req,res)=>{
  try {
    hb.regPartial('src/handlebars/layout.handlebars');
    const template = hb.getTemplate('src/handlebars/realTimeProducts.handlebars');

    const allProducts = await fetch('http://localhost:8080/api/products/')
      .then((res)=>{
        return res.json()
      }
    )

    var context = {
      allProducts: allProducts.payload,
      file: 'realTimeProd.css',
      title: 'Hola Alan',
    };
  
    var salida = template(context);
    res.send(salida);
  } catch (error) {
    console.log(error);
  }
})

route.get('/products', async(req,res)=>{
  try {
    hb.regPartial('src/handlebars/mainLayout.handlebars');
    const template = hb.getTemplate('src/handlebars/main.handlebars');

    const allProducts = await fetch('http://localhost:8080/api/products/')
      .then((res)=>{
        return res.json()
      }
    )

    var context = {
      allProducts: allProducts.payload,
      file: 'main.css',
      title: 'My Products',
    };
  
    var salida = template(context);
    res.send(salida);
  } catch (error) {
    console.log(error);
  }
})

route.get('/carts/:cid', async(req,res)=>{
  const cid = req.params.cid
  try {
    hb.regPartial('src/handlebars/cart/cartLayout.handlebars');
    const template = hb.getTemplate('src/handlebars/cart/cart.handlebars');

    const cartProducts = await fetch(`http://localhost:8080/api/carts/${cid}`)
    .then((res)=>{
      return res.json();
    })


    var context = {
      allProducts: cartProducts.productos,
      file: 'cart.css',
      title: 'My Cart',
    };
  
    var salida = template(context);
    res.send(salida);
  } catch (error) {
    console.log(error);
  }
})

route.get('/products/:pid', async(req,res)=>{
  const pid = req.params.pid;
  try {
    hb.regPartial('src/handlebars/product/productLayout.handlebars');
    const template = hb.getTemplate('src/handlebars/product/product.handlebars');

    const getProduct = await fetch(`http://localhost:8080/api/products/${pid}`)
    .then((res)=>{
      return res.json();
    })

    var context = {
      product: getProduct,
      file: 'product.css',
      title: 'Product Details',
    };
  
    var salida = template(context);
    res.send(salida);
  } catch (error) {
    console.log(error);
  }
})
export default route;