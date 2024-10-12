import express from "express";
import { Router } from "express";
import rProducts from "./src/routes/rProducts.js"
import rCarts from "./src/routes/rCarts.js"

const app = express();
const PORT = 8080;




app.use(express.json())
app.get('/', function (req, res) {
  res.send('<h1>Bienvenido<h1>')
})
app.use(rProducts);
app.use(rCarts)

app.listen(PORT, ()=>{
  console.log(`Server online at http://localhost:${PORT}`);
})