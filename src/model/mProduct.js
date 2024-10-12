import { json } from 'express';
import { write } from 'fs';
import fs from 'fs/promises';
import path from 'path';
export default class mProduct  {
  static productPath = path.resolve('data/productos.json');

  async get(pid){
    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'r');
      const data = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });//probar si jala
      if(data.length === 0){
        throw new Error("No existen productos.");
      }
      const dataJson = JSON.parse(data);

      const productpid = dataJson.filter(product => product.id === pid); //Asegurarnos que sean strings

      if( productpid.length === 0 || !productpid.products){
        throw new Error("El product ID es incorrecto"); 
      }

      return productpid;

    } catch (error) {
      console.log('Error en mProducts');
      throw error;
    }finally{ 
      await filehandle.close();
  }
  }
  async getAll(){
    let filehandle;
    try {
      filehandle = await fs.open(mProduct.productPath, 'r');
      const data = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });//probar si jala
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
      let readData = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });//probar si jala
      if(readData.length === 0){
        readData = '[]';
      }
      const actualProducts = JSON.parse(readData);
      const updatedProducts = JSON.stringify([newProduct, ...actualProducts]);
      const writeData = await fs.writeFile(mProduct.productPath,  updatedProducts );
      return writeData;
    } catch (error) {
      console.log(error);
      throw error;
    }finally{
      await filehandle.close();
    }
  }

  async delete(pid){
    console.log(pid);
    let filehandle;
    try {
        filehandle = await fs.open(mProduct.productPath, 'a');
        let readData = await fs.readFile(mProduct.productPath, { encoding: 'utf8' });//probar si jala
        if(readData.length === 0){
          throw new Error("No existen datos en el documento productos");
        }
        const actualProducts = JSON.parse(readData);
        const deleteProduct = actualProducts.filter(product => product.id !== pid);
        if(actualProducts.length === deleteProduct.length){
          throw new Error("El ID del producto no existe");
          
        }

        const updatedProducts = JSON.stringify(deleteProduct);

        const writeData = await fs.writeFile(mProduct.productPath,  updatedProducts );
        return writeData;

    }catch(error){
      throw(error)
    }finally{
      await filehandle.close()
    }
  }
}