import fs from 'fs/promises';
import settings from '../helpers/configurarion.js';
import path from 'path';
class mCart  {


  static cartPath = path.resolve('data/carrito.json');

  async get(cid){
    let filehandle;
    try {
      filehandle = await fs.open(mCart.cartPath, 'r');
      const data = await fs.readFile(mCart.cartPath, { encoding: 'utf8' });
      const dataJson = JSON.parse(data);

      const productcid = dataJson.filter(cartid => cartid.id === cid);
      if(productcid.length === 0){
        throw new Error("El carrito ID es incorrecto"); 
      }

      return productcid[0].products;
    } catch (error) {
      throw error;
    }finally{ 
      await filehandle.close();
  }
  }
  async create(id, products){
    let filehandle;
    try {
      filehandle = await fs.open(mCart.cartPath, 'a');
      let readData = await fs.readFile(mCart.cartPath,{ encoding: 'utf8' } );
      if(readData.length === 0){
        readData = '[]';
      }
      const objectData = JSON.parse(readData);
      objectData.push({id,products})
      const data = await fs.writeFile(mCart.cartPath, JSON.stringify(objectData, null, settings.SPACE));
      return data;
    } catch (error) {
        throw error;

    }finally{
      await filehandle.close();
    }
  }
  async add (product, cid, pid){
    let filehandle;
    try {
      filehandle = await fs.open(mCart.cartPath, 'a');
      const readData = await fs.readFile(mCart.cartPath,{ encoding: 'utf8' } );
      if(readData.length === 0){
        throw new Error("Error no hay carro. Crea un carrito primero");
      }

      const actualData = JSON.parse(readData);

      const agregarFn = ( pid, cartObj, newP)=>{
        let newArrayP = [];
        const arrayP = cartObj.products;
        const productF = arrayP.filter(product => product.id === pid);

        if(productF.length === 0){
          newArrayP = [{id:pid, ...newP}, ...arrayP]
        }else if(productF.length > 0){
          const filterAll = arrayP.filter(product => product.id !== pid)
          newArrayP = [{...productF[0], quantity: productF[0].quantity + newP.quantity}, ...filterAll]
        }
        return{...cartObj, products: newArrayP}

      }

      const result = actualData.map((cart) => {
        if(cart.id === cid){
            const cartData = agregarFn(pid, cart, product)
            return cartData
        }else{
          return cart;
        }
      })
      
      const data = await fs.writeFile(mCart.cartPath, JSON.stringify(result, null, settings.SPACE));
      return data;
    } catch (error) {
        throw error;

    }finally{
      await filehandle.close();
    }
  }
}
export default mCart;

