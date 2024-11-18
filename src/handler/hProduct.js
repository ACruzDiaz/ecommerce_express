import productModel from '../model/mProduct.js'
import mwValidate from '../middleware/mwValidate.js';
import cartModel from '../model/mCart.js';


export default class hProduct {
  static async get (req, res){
    const pid = req.params.pid;
    try {
      const data = await productModel.findOne({_id:pid}).lean()
      if(data ){
        res.status(200).json(data);
      }else{
        throw new Error(`El producto ${pid} no existe en la base de datos`);
      }

    } catch (error) {
      res.status(400).json({message: error.message});
    }
  }
  static async getAll(req,res){
    let result;
    let filters = {}
    let {limit, page, sort, query, categoria, disponibilidad} = req.query
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    try {

      limit || 10
      page || 1 

      categoria && (filters.category = categoria);
      disponibilidad && (filters.status = disponibilidad);
      query && (filters.title = query);
      const sortOpt = (sort == 'asc' || sort == 'desc') ? {price : sort}: {}
      
      limit = Number(limit)
      page = Number(page)
      result = await productModel.paginate(filters, {limit, page, lean:true, sort:sortOpt})
      if(result){
        result.status = 'success'
        result.prevLink =  result.hasPrevPage ? replaceQuery(fullUrl, 'page', result.page, result.prevPage) : null
        result.nextLink = result.hasNextPage ? replaceQuery(fullUrl, 'page', result.page, result.nextPage) : null
        result.payload = result.docs
        delete result.docs
        delete result.totalDocs
        delete result.pagingCounter
        delete result.limit
        res.status(200).json(result);
      }else{
        throw new Error("No se encontraron productos");
      }

    } catch (error) {
      res.status(400).json({
        message: error.message,
        status: error 
      });
    }
  }
  static async add(req, res){
    const validateIns = new mwValidate();
    const reqData = req.body;
    try {
      //Validación de integridad de datos
      await validateIns.product(reqData);

      //Validar que el producto no exista en la BD
      const findProduct = await productModel.findOne({code: reqData.code})
      if(findProduct){
        throw new Error("El producto ya se encuentra registrado en la base de datos.");
        
      }
      const newProduct = {...reqData};
      const result = new productModel(newProduct)
      const isSaved = await result.save()

      if(isSaved){
        res.status(200).json({message: `El producto con id ${isSaved._id} ha sido registrado en la base de datos.`});
      }

    } catch (err) {
      res.status(400).json({message:err.message})
    }
  }

  static async update(req, res){
    const pid = req.params.pid;
    const newProduct = req.body;
    const validateIns = new mwValidate();
    try {
      //validar datos
      await validateIns.product(newProduct);

      const fone = await productModel.findOneAndUpdate({
        _id : pid,
      },
      {
        title: newProduct.title,
        description: newProduct.description,
        code: newProduct.code,
        price: newProduct.price,
        status: newProduct.status,
        stock: newProduct.stock,
        category: newProduct.category
      },
      {
        new: true
      }

      )
      if(fone){
        res.status(200).json({message: `Producto ${pid} actualizado correctamente`});

      }
    } catch (error) {
      res.status(400).json({message: error.message});
      
    }
  }
  static async delete(req, res){
    const pid = req.params.pid;

    try {
      const deleteModel = await productModel.findOneAndDelete(
        {
          _id : pid
        },
      )

      if(deleteModel){
        const deleteEmpty = await cartModel.updateMany(
          { 
          },
          {
            $pull:{
              productos:{
                code:pid
              }
            }
          })  
  
        res.status(200).json({message:`Articulo ${pid} borrado exitosamente`})
      }else{
        throw new Error("El producto no existe");
        
      }
    } catch (error) {
      res.status(400).json({message: `Error al intentar borrar el producto ${pid}`})
    }
  }
}


const replaceQuery = (url, query, oldValue, newValue)=>{
  let newQuery;
  url.includes('http://localhost:8080/api/products') 
  ? newQuery = `http://localhost:8080/api/products/?${query}=${newValue}` 
  : newQuery = String(url).replace(`${query}=${oldValue}`, `${query}=${newValue}`)
  return newQuery
  
}


// const producto = {
//   id:'Se autogenera',
//   title: "Pelota",
//   description: "Pelota redonda",
//   code: "ADSASDF",
//   price: 12.20,
//   status: true,
//   stock: 10,
//   category: "Deportes",
//   thumbnails: ["imagen-1", "imagen-2"] //Este campo es opcional
// }