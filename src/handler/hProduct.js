import mProduct from '../model/mProduct.js';
import validateLength from '../middleware/validateLength.js';
export default class hProduct {
  constructor(req, res){
    this.req = req;
    this.res = res;
  }

  async get (){
    const pid = this.req.params.pid;
    const product = new mProduct();
    try {
      //Abrir el archivo product y leerlo
      const data = await product.get(pid);
      this.res.status(200).json(data.products);

    } catch (error) {
      this.res.status(400).send(error.message);
    }

    

  }
  async getAll(){
    const product = new mProduct();
    try {
      const result = await product.getAll();
      this.res.status(200).json(result);

    } catch (error) {
      this.res.status(400).send(error.message)
    }
  }
  async add(){
    const product = new mProduct();
    
    try {
      const id = crypto.randomUUID();
      const reqData = this.req.body;
      //Validación
      //Revisar que el codigo del articulo no este repetido(opcional)
      //Generar ID
      const newProduct = {id, ...reqData};
      const result = await product.add(newProduct);

      if(result === undefined){
        this.res.status(200).send("Producto agregado");
      }

    } catch (err) {
      this.res.status(400).send("Error al intentar agregar el producto")
    }
  }
  async delete(){
    const pid = this.req.params.pid;

    const product = new mProduct();
    try {
      const deleteModel = await product.delete(pid);

      if(deleteModel === undefined){
        this.res.status(200).send(`Articulo ${pid} borrado exitosamente`)
      }
    } catch (error) {
      this.res.status(400).send(`Error al intentar borrar el producto ${pid}`)
    }
  }
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