import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema(
    {
      title:String,
      description: String, 
      code: {
        type: String, 
        unique: true
      }, 
      price: Number,
      status: Boolean,
      stock: {
        type: Number, 
        default: 0
      }, 
      category: String,
    },

    {
        timestamps: true,
    }
  )
  productSchema.plugin(paginate)
  const productModel = mongoose.model("productos", productSchema); 
export default productModel