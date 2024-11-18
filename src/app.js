import  {app}  from './server/expressServer.js'
import { Server } from "socket.io";
import mongo from './mongoose/config.js';


const PORT = 8080;


mongo.connect();
const server = app.listen(PORT, ()=>{
  console.log(`Server online at http://localhost:${PORT}`);
})

const io = new Server(server);


io.on('connection', (socket) => {
  console.log(io.engine.clientsCount, 'user connected');
  socket.on('update', async (req)=>{

    try {
    //   const allProducts = await fetch('http://localhost:8080/api/products/')
    //   .then((res)=>{
    //     return res.json()
    //   }
    // )
    //   const products = allProducts.payload
    //   socket.emit('productos',products )
    } catch (error) {
      console.log(error);
    }
  })
});

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

export default io;
