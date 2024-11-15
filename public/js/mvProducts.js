const URL_SERVER = 'http://localhost:8080/api/'
const sw = Swal
let cid = null
const message = (title, res)=>{
  sw.fire({
    title: title,
    text: res.statusText
  })
}




document.addEventListener("DOMContentLoaded", ()=>{
  const _add2Cart = document.getElementsByClassName('add2Cart');

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

  document.addEventListener('click', (el)=>{

    if(el.target.className == 'add2Cart'){
      const setData = async()=>{
        cid = localStorage.getItem('cid')
        if(!cid){
          cid = await handleCart(`http://localhost:8080/api/carts`,options )
          localStorage.setItem('cid',cid)
        }
      }

      el.preventDefault();
      const pid = el.target.id
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

  })
})
