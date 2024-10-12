const validateLength = (LENGTH, ...params)=>{
  try {
    const spreadLength = params.length;

    if(spreadLength != LENGTH){
      throw new Error("Parametros incorrectos")
    }
    params.forEach((el)=>{
      if(el.length == 0){
        throw new Error("El campo no puede ir vacio");
      }
    })
  } catch (error) {
    throw error
  }

}

export default validateLength;