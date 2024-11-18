import express from "express";
import rProducts from "../routes/rProducts.js"
import rCarts from "../routes/rCarts.js"
import rViewProducts from "../routes/rViewProducts.js"
const app = express();

app.set('case sensitive routing', true);
app.use(express.json())
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.route('/')
.get(function (req, res, next) {
  res.send('<h1>Bienvenido<h1>');
})

app.use(rViewProducts);
app.use('/api/products',rProducts);
app.use('/api/carts',rCarts)

app.get('/404', function(req, res, next){

  next();
});

app.use(function(req, res, next){
  res.status(404);

  res.format({
    html: function () {
      res.send(` PAGINA NO ENCONTRADA ${ req.url }`)
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    },
    default: function () {  
      res.status(406).send('Not Acceptable')
    }
  })
});


export { app };