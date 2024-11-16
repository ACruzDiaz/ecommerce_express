import productModel from '../model/mProduct.js'
import mwValidate from '../middleware/mwValidate.js';
import io from '../../app.js';
import cartModel from '../model/mCart.js';


export default class hProduct {
  constructor(req, res){
    this.req = req;
    this.res = res;
  }

  async get (){
    const pid = this.req.params.pid;
    try {
      const data = await productModel.findOne({_id:pid}).lean()
      if(data){

        this.res.status(200).json(data);
      }else{
        throw new Error(`El producto ${pid} no existe en la base de datos`);
      }

    } catch (error) {
      this.res.status(400).json({message: error.message});
    }
  }
  async getAll(){
    let result;
    let filters = {}
    let {limit, page, sort, query, categoria, disponibilidad} = this.req.query
    const fullUrl = this.req.protocol + '://' + this.req.get('host') + this.req.originalUrl;

    try {



      //El siguiente paso es hacer coincider el formato del objeto devuelto con el que se pide en las diapositivas.
      
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
        this.res.status(200).json(result);
      }else{
        throw new Error("No se encontraron productos");
      }

    } catch (error) {
      this.res.status(400).json({
        message: error.message,
        status: error 
      });
    }
  }
  async add(){
    const validateIns = new mwValidate();
    const reqData = this.req.body;
    try {
      //Validación
      await validateIns.product(reqData);
      const newProduct = {...reqData};
      const result = new productModel( newProduct)
      const isSaved = await result.save()

      if(isSaved){
        this.res.status(200).json({message: `El producto con id ${isSaved._id} ha sido registrado en la base de datos.`});
      }

    } catch (err) {
      this.res.status(500).json({message:err.message})
    }
  }

  async update(){
    const pid = this.req.params.pid;
    const newProduct = this.req.body;
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
        this.res.status(200).json({message: `Producto ${pid} actualizado correctamente`});

      }
    } catch (error) {
      this.res.status(400).json({message: error.message});
      
    }
  }
  async delete(){
    const pid = this.req.params.pid;

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
  
        this.res.status(200).json({message:`Articulo ${pid} borrado exitosamente`})
      }else{
        console.log('Errorrr');
        throw new Error("El producto no existe");
        
      }
    } catch (error) {
      this.res.status(400).json({message: `Error al intentar borrar el producto ${pid}`})
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


const producto = {
  id:'Se autogenera',
  title: "Pelota",
  description: "Pelota redonda",
  code: "ADSASDF",
  price: 12.20,
  status: true,
  stock: 10,
  category: "Deportes",
  thumbnails: ["imagen-1", "imagen-2"] //Este campo es opcional
}