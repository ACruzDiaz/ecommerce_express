import settings from '../helpers/configurarion.js';
import mongoose from 'mongoose';
import mongo from '../mongoose/config.js';

mongo.connect();
const carritoModelo=mongoose.model(
  "carritos",
  new mongoose.Schema(
    {
      productos: {
        type:[
          {
            id: String, 
            cantidad: Number
          }
        ]
      }
    },
    {
        timestamps: true
    }
  )
)
async function joe(){
  return await carritoModelo.create({productos:[]})
  
}
async function getById(id){   
  return await carritoModelo.findOne({_id:id})
}
const carrito = getById('672d5cbae6e638fa7cb41bba')
async function updateCarrito(carrito){
  const result = await carritoModelo.findByIdAndUpdate('672d5cbae6e638fa7cb41bba', {productos: [{cantidad:10, id:"mnoseosf"}]}, {new:true})
  console.log(result);
}
joe()
updateCarrito(carrito)