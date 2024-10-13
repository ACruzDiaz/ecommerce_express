import mCart from '../model/mCart.js';
import mwValidate from '../middleware/mwValidate.js';
import mProduct from '../model/mProduct.js';
class hCart {
  constructor(req, res){
    this.req = req;
    this.res = res;
  }

  async get (){
    const cid = this.req.params.cid;
    const carrito = new mCart();
    try {
      //Abrir el archivo Carrito y leerlo
      const data = await carrito.get(cid);

      this.res.status(200).json(data);

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
    }

  }

  async add(){
    const cid = this.req.params.cid;
    const pid = this.req.params.pid;
    const product = this.req.body
    const validateInst = new mwValidate();
    const model = new mCart();
    const modelProd = new mProduct();
    try {
      //Validar
      await validateInst.cartProduct(product);
      //Validar si los pid existen en el archivo de productos
      await modelProd.get(pid);
      //Validaar si el cid existe
      await model.get(cid);
      const mAdd = await model.add(product, cid, pid);
      if(mAdd === undefined){
        this.res.status(200).send("Productos añadidos al carrito")
      }
      
    } catch (error) {
      this.res.status(400).send(error.message)
    }

  }
}
export default hCart;