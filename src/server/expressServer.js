import express from "express";
import rProducts from "../routes/rProducts.js"
import rCarts from "../routes/rCarts.js"
import vProducts from "../views/vProducts.js"

const app = express();
app.use(express.json())
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('<h1>Bienvenido<h1>')
})
app.use(vProducts)
app.use(rProducts);
app.use(rCarts)

export { app };