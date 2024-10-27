const URL_SERVER = 'http://localhost:8080/api/'
const sw = Swal
const message = (title, res)=>{
  sw.fire({
    title: title,
    text: res.statusText
  })
}
const insertProducts = (productArray)=>{
  let newTable = document.createElement('tbody')
  productArray.forEach((el, index) => {
    newTable.insertRow(-1).innerHTML = `<th>${index}</th>
          <th>${el.id}</th>
          <th>${el.title}</th>
          <th>${el.description}</th>
          <th>${el.code}</th>
          <th>${el.price}</th>
          <th>${el.status}</th>
          <th>${el.stock}</th>
          <th>${el.category}</th>`
  });
  return newTable;
}



document.addEventListener("DOMContentLoaded", ()=>{
  const _productsForm = document.getElementById('productsForm')
  const _mainTable = document.getElementById('mainTable')
  const _create = document.getElementById('create');
  const _delete = document.getElementById('delete');
  const _pid = document.getElementById('pid');
  const _title= document.getElementById('title');
  const _description= document.getElementById('description');
  const _code= document.getElementById('code');
  const _price= document.getElementById('price');
  const _status= document.getElementById('status');
  const _stock= document.getElementById('stock');
  const _category= document.getElementById('category');

  socket.on('productos', (array)=>{
    _mainTable.innerHTML = insertProducts(array).innerHTML;

  }); 


  _create.addEventListener('click', (e)=>{
    e.preventDefault();

    const title = _title.value
    const description = _description.value
    const code = _code.value
    
    const price = parseFloat(_price.value )
    const status = _status.checked ? true: false;
    const stock = parseInt(_stock.value)
    const category = _category.value
    const options = {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,description,code,price,status,stock,category
      })
    }
    fetch(URL_SERVER + 'products', options).then((res)=>{
      if (!res.ok){
        message("Error", res)  
      }
      else{
        socket.emit('update','true')
      }
      //If res.ok
       //1. El cliente escuchara una respuesta del servidor
      //2. Si la respuesta es satisfactoria (son productos), cerramos la conexión
    }).catch(err => sw.fire(err))
    _productsForm.reset();
  })
  _delete.addEventListener('click', (e)=>{
    e.preventDefault();
    const options = {
      method:"DELETE",
    }
    const pid = _pid.value;

    fetch(URL_SERVER + 'products/' + pid, options)
      .then((res)=>{
        if (!res.ok) {
          message('Error', res)
        }else{
          socket.emit('update','true')
        }
        })
      .catch((err)=>{
        sw.fire('Unexpected Error'); 
        console.log(err);
      })

    _pid.value = '';
  })

})
