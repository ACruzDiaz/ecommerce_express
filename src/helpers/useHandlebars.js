import handlebars from "handlebars";
import fs from 'fs'

const getTemplate = (archivo) =>{
  let source = fs.readFileSync(archivo, 'utf-8');
  let template = handlebars.compile(source);
  return template;
}

const regPartial = (archivo) =>{
  let source = fs.readFileSync(archivo, 'utf-8');
  const add = handlebars.registerPartial('layout',source);

}

export default {getTemplate, regPartial}