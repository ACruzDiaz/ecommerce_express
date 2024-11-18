import cartModel  from '../model/mCart.js';
import mwValidate from '../middleware/mwValidate.js';
import productModel from '../model/mProduct.js';

class hCart {

  static async get (req,res){
    const cid = req.params.cid;
    try {
      const data = await cartModel.findOne({_id: cid}).populate('productos.code').lean()
      
      if(data){
        res.status(200).json(data)
      }else{
        throw new Error(`Error al encontrar el carrito: ${cid}, asegurese de que el carrito esta registrado.`)
      }

    } catch (error) {
      error.message ? res.status(400).json({message: error.message}) : res.status(400).json({message: "Unexpected Error"})
    }
  }

  static async create(req,res){
    try {
      const newCart = new cartModel({productos:[]});
      const isSaved = await newCart.save();
      if(isSaved){
        res.status(200).json({message: `Carrito con id ${isSaved._id}, creado correctamente.`, id: isSaved._id})
      }else{
        throw new Error("Error al crear el carrito. Por favor intente nuevamente");
        
      }

    } catch (error) {
        res.status(500).json({message: error.message})
    }

  }

  static async add(req,res){
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = 1;

    try {
      const productToAdd = await productModel.findById(pid);
      if(productToAdd === null){
        throw new Error('El producto no existe la base de datos')
      }

      const cartToUpdate = await cartModel.findById(cid)
      if(cartToUpdate === null){
        throw new Error('El carrito no existe en la base de datos')
      }

      const findIDinProd = await cartModel.findOne(
        {
          'productos.code': pid,
          _id: cid
        }
      )
      if (findIDinProd){
        const productExist = await cartModel.findOneAndUpdate(
          { 
            _id : cid,
            'productos.code': pid 

          },
          {
            $inc: {
              'productos.$[elem].quantity': quantity
            },
          },
          {
            arrayFilters: [{ 'elem.code': pid }],
            new : true,
          }
        );        
      }else{
        await cartModel.findOneAndUpdate(
          { _id: cid },
          {
            $push: {
              productos: {
                quantity: quantity,
                code: pid,
              }
            }
          },
          {
            new: true,
            upsert: true
          }
        );
      }
      res.status(200).json({message:`Se han agregado ${quantity} unidades de ${productToAdd.title} al carrito ${cid}`});

    } catch (error) {
      res.status(400).json({message: error.message})
    }
  }

  static async deleteOneProduct(req,res){
    const cid = req.params.cid
    const pid = req.params.pid
    try {
      const productExist = await cartModel.findOne(
        { 
          _id : cid,
          'productos.code': pid 

        },
        {

        },
        {
          arrayFilters: [{ 'elem.code': pid }],
          new : true,
        }
      );        

      if(!productExist){
        throw new Error(`Error al eliminar el producto ${pid}. Revise que el producto se encuentre en su carrito.`); 

      }
      const fone = await cartModel.findOneAndUpdate(
        { 
          _id : cid,

        },
        {
          $pull: {
            'productos': {
              code:{
                $eq: pid,
              }
            }
          },
        },
        {
          new : true,
        })
      if(!fone){

        throw new Error(`Error al eliminar el producto ${pid}. Revise que el carrito exista.`); 
      }
      res.status(200).json({message:`Se ha borrado ${pid} del carrito ${cid}`});
        
    } catch (error) {
      res.status(400).json({message: error.message})
      
    }
  }

  static async updateManyProducts(req,res){
    const cid = req.params.cid
    const arrayProducts = req.body
    const validar = new mwValidate()

    try {
      //Validación de la integridad de los datos
      validar.updateMany(arrayProducts)
      const cartExist = await cartModel.findById(cid);
      //Validación de la existencia de los productos en la BD
      for (const element of arrayProducts) {
        const prodExist = await productModel.findById(element.code)
        console.log(prodExist);
        if(!prodExist){
          throw new Error(`El producto ${element.code} no existe en la base de datos`);
        }
      }
      //Validación de la existencia del carrito
      if(!cartExist){
        throw new Error(`El carrito ${cid} no existe.`);
      }

      const actualCart = new cartModel(cartExist);
      actualCart.productos = arrayProducts;

      const isSaved = await actualCart.save();
      if(!isSaved){
        throw new Error("Error al guardar los cambios.");
      }
      res.status(200).json({message:`El carrito ${cid} se actualizó correctamente`});

    } catch (error) {
      res.status(400).json({message: error.message})
      
    }
  }

  static async deleteAll(req,res){
    const cid = req.params.cid

    try {
      const findCart = await cartModel.findById(cid) 
      if(!findCart) throw new Error("El carrito no existe en la base de datos");
      
      const updatedCart = new cartModel(findCart)
      updatedCart.productos = [];
      const isSaved = await updatedCart.save()
      if(!isSaved) throw new Error("Error al actualizar el carrito. Intente de nuevo.");

      res.status(200).json({message:`El carrito ${cid} se vació correctamente`});
      

    } catch (error) {
      res.status(400).json({message: error.message})
      
    }
  }
}
export default hCart;