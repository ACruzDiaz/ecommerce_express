import mCart from '../model/mCart.js';
import validateLength from '../middleware/validateLength.js';
class hCart {
  constructor(req, res){
    this.req = req;
    this.res = res;
  }

  async get (){
    const cid = this.req.params.cid;
    console.log(cid);
    const carrito = new mCart();
    try {
      //Abrir el archivo Carrito y leerlo
      const data = await carrito.get();
      //Buscar el carrito ${cid}
      const productcid = data.filter(cartid => cartid.id === cid); //Asegurarnos que sean strings
      //guardar el array 'products'
      //usar el metodo res para mandar el array al cliente

      if(productcid.length === 0){
        throw new Error("El carrito ID es incorrecto"); 
      }

      if(!productcid.products || productcid.products.length === 0){
        throw new Error("No hay productos en el carrito")
      }
      this.res.status(200).json(productcid.products);

    } catch (error) {
      this.res.status(400).send(error.message);
    }

    

  }

  async create(){
    const id = crypto.randomUUID();
    const products = [];
    const model = new mCart();
    try {
      const result = await model.create(id, products);
      if(this.result !== undefined){
        this.res.status(500).send("Error al crear carrito")
      }
      this.res.status(200).send('Carrito creado')
    } catch (error) {
      console.log(error)
    }

  }

  async add(){
    const cid = this.req.params.cid;
    const pid = this.req.params.pid;
    const product = this.req.body
    const productArray = Object.values(product);
    //Validar
    try {
      validateLength ( 2,...productArray );
      product.quantity = Number(product.quantity);
      if(product.quantity < 1){
        throw new Error("Ingrese una cantidad mayor a 0")
      }
    } catch (error) {
      throw new Error("Ingrese una cantidad numerica");
      
    }
    try {
      //Validar si los pid existen en el archivo de productos (primero programar mProductos)
      const model = new mCart();
      const mAdd = await model.add(product, cid, pid);
      if(mAdd === undefined){
        this.res.status(200).send("Productos añadidos al carrito")
      }
      
    } catch (error) {
      this.res.status(400).sed(error.message)
      console.log(error)
    }

  }
}
export default hCart;