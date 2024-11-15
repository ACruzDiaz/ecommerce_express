import mongoose from 'mongoose';

const cartModel = mongoose.model(
  "carritos",
  new mongoose.Schema(
    {
      productos:[{
            code: {
               type: mongoose.Schema.Types.ObjectId, 
               ref: 'productos' 
            }, 
            quantity: Number
          }]
      }
    ,
    {
        timestamps: true
    }
  )
)


export default cartModel;