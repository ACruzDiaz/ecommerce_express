import  settings  from '../helpers/configurarion.js';
import fs from 'fs/promises';
import path from 'path';
export default class mProduct  {
  static productPath = path.resolve('data/productos.json');

  async get(pid){
    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'r');
      const data = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });
      if(data.length === 0){
        throw new Error("No existen productos.");
      }
      const dataJson = JSON.parse(data);
      const productpid = dataJson.filter(product => product.id === pid);

      if( productpid.length === 0 || !productpid){
        throw new Error("El product ID es incorrecto"); 
      }

      return productpid;

    } catch (error) {
      throw error;
    }finally{ 
      await filehandle.close();
  }
  }
  async getAll(){

    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'r');
      const data = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });
      if(data.length === 0){
        throw new Error("No existen productos.");
      }

      const dataJson = await JSON.parse(data);

      return dataJson;

    }catch (err) {
      throw err;
    }finally{
      await filehandle.close();
    }
  }

  async add(newProduct){
    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'a');
      let readData = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });
      if(readData.length === 0){
        readData = '[]';
      }
      const actualProducts = JSON.parse(readData);
      const updatedProducts = JSON.stringify([newProduct, ...actualProducts], null, settings.SPACE);
      const writeData = await fs.writeFile(mProduct.productPath,  updatedProducts );
      return writeData;
    } catch (error) {
      throw error;
    }finally{
      await filehandle.close();
    }
  }
  async update(pid, newProduct){
    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'a');
      let readData = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });
      if(readData.length === 0){
        throw new Error("No existen datos para editar en el documento productos");
      }
      const dataJson = JSON.parse(readData);
      if(dataJson.length === 0){
        throw new Error("No existen productos para editar");
      }
      const newProducts = dataJson.map((product) =>{
        if(product.id === pid){
          return {...product, ...newProduct}
        }else{
          return product;
        }
      })

      const writeData = await fs.writeFile(mProduct.productPath,  JSON.stringify(newProducts, null, settings.SPACE));

      return writeData;
    } catch (error) {
      throw error;
      
    }finally{
      await filehandle.close();
    }
  }
  async delete(pid){
    let filehandle;
    try {
        filehandle = await fs.open(mProduct.productPath, 'a');
        let readData = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });
        if(readData.length === 0){
          throw new Error("No existen datos en el documento productos");
        }
        const actualProducts = JSON.parse(readData);
        const deleteProduct = actualProducts.filter(product => product.id !== pid);
        if(actualProducts.length === deleteProduct.length){
          throw new Error("El ID del producto no existe");
          
        }

        const updatedProducts = JSON.stringify(deleteProduct, null, settings.SPACE);

        const writeData = await fs.writeFile(mProduct.productPath,  updatedProducts );
        return writeData;

    }catch(error){
      throw(error)
    }finally{
      await filehandle.close();
    }
  }
}