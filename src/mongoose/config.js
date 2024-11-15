import mongoose from "mongoose"

// const mongooseKeys = {
//   url : "mongodb+srv://alanjs.qogca.mongodb.net/",
//   userPw : "PTqnSkBBIx9NVSPJ"
// }

const mongo = {
  url : "mongodb+srv://alanuser:PTqnSkBBIx9NVSPJ@alanjs.qogca.mongodb.net/",
  connect: async ()=>{

    await mongoose.connect(mongo.url)
    console.log('Base de datos en linea');
  }

}

export default mongo