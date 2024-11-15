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
    newTable.insertRow(-1).innerHTML = `
          <th class = "pid">${String(el._id)}</th>
          <th>${el.title}</th>
          <th>${el.price}</th>
          <th>${el.category}</th>`
  });
  return newTable;
}



document.addEventListener("DOMContentLoaded", ()=>{
  const _productsForm = document.getElementById('productsForm')
  const _mainTable = document.getElementById('mainTable')

  //Obtener la informacion del carrito

  const fetchCart = async (url)=>{
    const result = await fetch(url);
    if(!result.ok) throw new Error("Error al realizarr petición del carrito");
    const data = await result.json();
    console.log(data.productos);
    return data.productos
  }

  const handleCart = async() => {
    try {
      if(!cid){
        throw new Error("");
      }
  
      dataState = await fetchCart(`http://localhost:8080/carts/${cid}`)      
    } catch (error) {
      
    }

  }

})
