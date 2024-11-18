import mongoose from "mongoose"

const mongo = {
  url : "mongodb+srv://alanuser:PTqnSkBBIx9NVSPJ@alanjs.qogca.mongodb.net/",
  connect: async ()=>{

    await mongoose.connect(mongo.url)
    console.log('Base de datos en linea');
  }

}

export default mongo