import cartModel  from '../model/mCart.js';
import mwValidate from '../middleware/mwValidate.js';
import productModel from '../model/mProduct.js';

class hCart {
  constructor(req, res){
    this.req = req;
    this.res = res;
  }

  async get (){
    const cid = this.req.params.cid;
    try {
      
      const data = await cartModel.findOne({_id: cid}).populate('productos.code').lean()
      
      if(data){
        this.res.status(200).json(data)
      }else{
        throw new Error(`Error al encontrar el carrito: ${cid}, asegurese de que el carrito esta registrado.`)
      }
      //Delete Empty


    } catch (error) {
      error.message ? this.res.status(400).json({message: error.message}) : this.res.status(400).json({message: "Unexpected Error"})
    }
  }

  async create(){
    try {
      const newCart = new cartModel({productos:[]});
      const isSaved = await newCart.save();
      if(isSaved){
        this.res.status(200).json({message: `Carrito con id ${isSaved._id}, creado correctamente.`, id: isSaved._id})
      }else{
        throw new Error("Error al crear el carrito. Por favor intente nuevamente");
        
      }

    } catch (error) {
        this.res.status(500).json({message: error.message})
    }

  }

  async add(){
    const cid = this.req.params.cid;
    const pid = this.req.params.pid;
    const quantity = this.req.body
    const validateInst = new mwValidate();

    try {
      await validateInst.cartProduct(quantity);

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
              'productos.$[elem].quantity': quantity.quantity
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
                quantity: quantity.quantity,
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
      this.res.status(200).json({message:`Se han agregado ${quantity.quantity} unidades de ${productToAdd.title} al carrito ${cid}`});

    } catch (error) {
      this.res.status(400).json({message: error.message})
    }
  }

  async deleteOneProduct(){
    const cid = this.req.params.cid
    const pid = this. req.params.pid
    try {
      //Queda pendiente asegurarnos si el producto existia en el carrito antes de borrarlo
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
        
      this.res.status(200).json({message:`Se ha borrado ${pid} del carrito ${cid}`});
        
    } catch (error) {
      this.res.status(400).json({message: error.message})
      
    }
  }

  async updateManyProducts(){
    const cid = this.req.params.cid
    const arrayProducts = this.req.body
    try {
     const cartExist = await cartModel.findById(cid);
     if(!cartExist){
      throw new Error(`El carrito ${cid} no existe.`);
     }

     const actualCart = new cartModel(cartExist)
     actualCart.productos = arrayProducts
     const isSaved = await actualCart.save();
     if(!isSaved){
      throw new Error("Error al guardar los cambios.");
     }
     this.res.status(200).json({message:`El carrito ${cid} se actualizó correctamente`});


    } catch (error) {
      this.res.status(400).json({message: error.message})
      
    }
  }

  async deleteAll(){
    const cid = this.req.params.cid

    try {
      const findCart = await cartModel.findById(cid) 
      if(!findCart) throw new Error("El carrito no existe en la base de datos");
      
      const updatedCart = new cartModel(findCart)
      updatedCart.productos = [];
      const isSaved = await updatedCart.save()
      if(!isSaved) throw new Error("Error al actualizar el carrito. Intente de nuevo.");

     this.res.status(200).json({message:`El carrito ${cid} se vació correctamente`});
      

    } catch (error) {
      this.res.status(400).json({message: error.message})
      
    }
  }
}
export default hCart;