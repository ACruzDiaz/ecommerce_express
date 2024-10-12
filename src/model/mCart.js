import fs from 'fs/promises';
import path from 'path';
class mCart  {


  static cartPath = path.resolve('data/carrito.json');

  async get(){
    let filehandle;
    try {
      filehandle = await fs.open(mCart.cartPath, 'r');
      const data = await fs.readFile(mCart.cartPath, { encoding: 'utf8' });//probar si jala
      
      if(data.length === 0){
        throw new Error("No existen carros.");
      }
      
      return JSON.parse(data);
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
      const data = await fs.writeFile(mCart.cartPath, JSON.stringify(objectData));
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

      const objectData = JSON.parse(readData);

      const agregar = ( pid, cartObj, newP)=>{
        let newArrayP = [];

        const arrayP = cartObj.products;
        if(!Array.isArray(arrayP)){
          console.log("ArrayP no es un array valido");
          return;
        }
        const productF = arrayP.filter(product => product.id === pid)
        if(productF.length === 0){
          newArrayP = [newP, ...arrayP]
          console.log(newArrayP);
        }else if(productF.length > 0){
          const filterAll = arrayP.filter(product => product.id !== pid)
          newArrayP = [{...productF[0], quantity: productF[0].quantity + newP.quantity}, ...filterAll]
        }
        return{...cartObj, products: newArrayP}

      }

      const result = objectData.map((cart) => {
        if(cart.id === cid){
            const cartData = agregar(pid, cart, product)
            return cartData
        }
      })
      
      const data = await fs.writeFile(mCart.cartPath, JSON.stringify(result));
      return data;
    } catch (error) {
        throw error;

    }finally{
      await filehandle.close();
    }
  }
}
export default mCart;

