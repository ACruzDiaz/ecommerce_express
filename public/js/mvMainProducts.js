const URL_SERVER = 'http://localhost:8080/api/'
const sw = Swal
let dataState = null;
let cid = null;
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
          <th class = "pid"> <a href = "http://localhost:8080/products/${String(el._id)}">${String(el._id)} </a></th>
          <th>${el.title}</th>
          <th>${el.description}</th>
          <th>${el.code}</th>
          <th>${el.price}</th>
          <th>${el.status}</th>
          <th>${el.stock}</th>
          <th>${el.category}</th>
          <th><button class = "add2Cart"> Agregar al carrito </button></th>`
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
  const _nextPage = document.getElementById('nextPage');
  const _prevPage = document.getElementById('prevPage');
  const _add2Cart = document.getElementsByClassName('add2Cart');

  socket.on('productos',(req)=>{
    _mainTable.innerHTML = insertProducts(req).innerHTML;
  })
  const handleData = async (url)=>{
    try {
      const response = await fetch(url)
      if (!response.ok) { throw new Error('Error: ' + response.statusText);}
      const data = await response.json(); 
      return data;
    } catch (error) {
      message('Error', error.message)
      return null;  
    }
  }

  const handleCart = async (url, options) =>{
    try{
      const response = await fetch(url, options)
      if (!response.ok) { throw new Error('Error: ' + response.statusText);}
      const data = await response.json(); 
      return data.id;

    }catch(error){
      message('Error', error.message)

    }
  }

  const setData = async(url)=>{
    const options = {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
    }
    dataState = await handleData(url);
    if(_prevPage && _nextPage){
      dataState.hasPrevPage ? _prevPage.disabled = false : _prevPage.disabled = true
      dataState.hasNextPage ? _nextPage.disabled = false : _nextPage.disabled = true  
    }
    if (_mainTable) {
      _mainTable.innerHTML = insertProducts(dataState.payload).innerHTML;
      
    }


    cid = localStorage.getItem('cid')
    if(!cid){
      cid = await handleCart(`http://localhost:8080/api/carts`,options )
      localStorage.setItem('cid',cid)
    }
    await fetch(`http://localhost:8080/api/carts/${cid}`)
      .then((res)=>{
        if(!res.ok){
          fetch(`http://localhost:8080/api/carts`,options ).then((res)=>{return res.json()})
          .then((data)=>{
            console.log(data.id);
            localStorage.setItem('cid',data.id)
            cid = localStorage.getItem('cid')

          })

        }

      }
      ) 
    console.log(localStorage.getItem('cid'));
    // console.log(dataState);
  } 

  setData(URL_SERVER + 'products');

  document.addEventListener('click', (el)=>{
    if(el.target.id === 'nextPage'){
      el.preventDefault();
      if (!dataState) {
        message('Error', 'No hay datos')
        return;
      }
      if (dataState.hasNextPage) {
        _nextPage.enabled = true
        setData(dataState.nextLink)
      }

    }

    if(el.target.id === 'prevPage'){
      el.preventDefault();
      if (!dataState) {
        message('Error', 'No hay datos')
        return;
      }
      if(dataState.hasPrevPage){
        setData(dataState.prevLink)
      }
    }

    if(el.target.className == 'add2Cart'){
      el.preventDefault();
      let pid = null;
      console.log(el.target.id);
      if (!el.target.id) {
        pid = el.target.parentNode.parentNode.querySelector('.pid').querySelector('a').textContent;
        
      }else{
        pid = el.target.id
      }


      const options ={   
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: 1
        })
      }
      fetch(URL_SERVER + 'carts/' + cid + '/product/' +pid, options)
        .then((res)=>{
          if(!res.ok) throw new Error();
          message('Producto añadido al carrito', `El producto ${pid} se añadió al carrito ${cid}`)
        }).catch((err)=>{
          message('Error', err.message)
        })
    }

    if (el.target.id === 'thisCart') {
      el.preventDefault()
      window.open(`http://localhost:8080/carts/${cid}`, '_blank')
      
    }
  })

  _create && _create.addEventListener('click', (e)=>{
    
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
    }).catch(err => sw.fire(err))
    _productsForm.reset();
  })

  _delete && _delete.addEventListener('click', (e)=>{
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
