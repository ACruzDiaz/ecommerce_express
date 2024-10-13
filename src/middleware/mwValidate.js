import ValidationError from "../helpers/PersonalizeErrors.js";

export default class mwValidate {
  product(el){
    const keysNumber = [7,8];
    const ProductKeys = ["title", "description", "code", "price", "status","stock","category"]
    const optionalKeys = ["thumbnails"];
    let keysToEval = [];
    
    try {
      
      const elKeys = Object.keys(el);
      if(elKeys.length < keysNumber[0] || elKeys.length > keysNumber[1]){
        throw new ValidationError("Numero de parametros incorrectos");
  
      }
      if(elKeys.length === keysNumber[1]){
        keysToEval = [...ProductKeys , ...optionalKeys];
      }else if(elKeys.length === keysNumber[0]){
        keysToEval = ProductKeys;
      }
  
      const requiredKeys = keysToEval.map((key)=>{
        if(!elKeys.includes(key)){
          return key;
        }
      }).filter(key => key !== undefined)
  
      if(requiredKeys.length !== 0){
        throw new ValidationError(`Hacen falta los parametros ${requiredKeys.toString()}`);
      }
      //Validar que los tipos de datos sean los correctos
      
  
      if(typeof el.title !== 'string' || el.title.length === 0) {
        throw new ValidationError("Error en el campo title");
        
      }else if(typeof el.description !== 'string' || el.description.length === 0){
        throw new ValidationError("Error en el campo description");
  
      }else if(typeof el.code !== 'string' || el.code.length === 0){
        throw new ValidationError("Error en el campo code");
  
      }else if(typeof el.price !== 'number' || Number.isNaN(el.price) || el.price < 0){
        throw new ValidationError("Error en el campo price");
  
      }else if(typeof el.status !== 'boolean' ){
        throw new ValidationError("Error en el campo status");
  
      }else if(typeof el.stock !== 'number' || !Number.isInteger(el.stock) || el.stock < 0){
        throw new ValidationError("Error en el campo stock");
  
      }else if(typeof el.category !== 'string' || el.category.length ===0){
        throw new ValidationError("Error en el campo category");
  
      }
    } catch (error) {
      throw new Error(error);
      
    }

  }

  cartProduct(el){
    const keysNumber = [1,1];
    const ProductKeys = ["quantity"];
    // const ProductKeys = ["id", "quantity"];
    const optionalKeys = [];
    let keysToEval = []; //No modify
    
    try {
      const elKeys = Object.keys(el);
      if(elKeys.length < keysNumber[0] || elKeys.length > keysNumber[1]){
        throw new ValidationError("Numero de parametros incorrectos");
  
      }
      if(elKeys.length === keysNumber[1]){
        keysToEval = [...ProductKeys , ...optionalKeys];
      }else if(elKeys.length === keysNumber[0]){
        keysToEval = ProductKeys;
      }
  
      const requiredKeys = keysToEval.map((key)=>{
        if(!elKeys.includes(key)){
          return key;
        }
      }).filter(key => key !== undefined)
  
      if(requiredKeys.length !== 0){
        throw new ValidationError(`Hacen falta los parametros ${requiredKeys.toString()}`);
      }
      //Validar que los tipos de datos sean los correctos
      
  
      // if(typeof el.id !== 'string' || el.id.length === 0) {
      //   throw new ValidationError("Error en el campo id");
        
      // }else 
      if(typeof el.quantity !== 'number' || !Number.isInteger(el.quantity) || el.quantity <= 0){
        throw new ValidationError("Error en el campo quantity");
  
      }
    } catch (error) {
      throw(error)
    }

  }

  
}

// const producto = {
//   title: "Pelota",
//   description: "Pelota redonda",
//   code: "ADSASDF",
//   price: 12.20,
//   status: true,
//   stock: 10,
//   category: "Deportes",
//   // thumbnails: ["imagen-1", "imagen-2"] //Este campo es opcional
// }

// const cartProducto = {
// 	id: "dfsfd",
// 	quantity: 9
// }
