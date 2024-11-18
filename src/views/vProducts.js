import hb from "../helpers/useHandlebars.js";

class vProducts {
   static async getRTProducts(req,res){
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
  }
  
  static async getProducts(req,res){
    let {limit, page, sort, query, categoria, disponibilidad} = req.query
    let stringParam = req.originalUrl;
    console.log(stringParam);
    try {
      hb.regPartial('src/handlebars/mainLayout.handlebars');
      const template = hb.getTemplate('src/handlebars/main.handlebars');


      const allProducts = await fetch(`http://localhost:8080/api${stringParam}`)
        .then((res)=>{
          return res.json()
        }
        ).catch((err)=>{
          return res.status(404).json({message:'Error al mostrar la pagina'})
        })
  
      var context = {
        allProducts: allProducts,
        file: 'main.css',
        title: 'My Products',
      };
    
      var salida = template(context);
      res.send(salida);
    } catch (error) {
      console.log(error);
    }
  }
  
  static async getCart(req,res){
    const cid = req.params.cid
    try {
      hb.regPartial('src/handlebars/cart/cartLayout.handlebars');
      const template = hb.getTemplate('src/handlebars/cart/cart.handlebars');
  
      const cartProducts = await fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((res)=>{
        if(!res.ok){
          return res.json().then((errorData)=>{
            throw new Error(errorData.message);
          })
      .then(data => data)
      .catch((err)=> {throw new Error(err.message)});
      
        }
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
      res.status(404).send(error.message);
    }
  }
  
  static async getOneProduct (req,res){
    const pid = req.params.pid;
    try {
      hb.regPartial('src/handlebars/product/productLayout.handlebars');
      const template = hb.getTemplate('src/handlebars/product/product.handlebars');
  
      const getProduct = await fetch(`http://localhost:8080/api/products/${pid}`)
      .then((res)=>{
        if(!res.ok){
          return res.json().then((errorData)=>{
            throw new Error(errorData.message);
          })
        }
        return res.json()
      }).then((data)=>{
        return data
      }).catch((err)=>{
        throw new Error(err.message);
      })

      var context = {
        product: getProduct,
        file: 'product.css',
        title: 'Product Details',
      };
    
      var salida = template(context);
      res.send(salida);
    } catch (error) {
      res.status(400).send(error.message)
      }
  }
}

export default vProducts;