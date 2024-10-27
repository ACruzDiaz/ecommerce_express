import  {app}  from './src/server/expressServer.js'
import { Server } from "socket.io";
import mProduct from './src/model/mProduct.js'

const PORT = 8080;

const server = app.listen(PORT, ()=>{
  console.log(`Server online at http://localhost:${PORT}`);
})

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(io.engine.clientsCount, 'user connected');
  socket.on('update', async (req)=>{
    const mpro = new mProduct()
    try {
      const products = await mpro.getAll()
      socket.emit('productos',products )
      console.log(req);
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
