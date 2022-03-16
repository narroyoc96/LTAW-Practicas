//Práctica 2: Tienda de ropa mejorada
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const url = require('url');
const http = require('http');
const fs = require('fs');
const { parse } = require('path');
const { isGeneratorFunction } = require('util/types');

//Definición del puerto
const PUERTO = 9090;

  //Definicion de todos los tipos de archivo
  const mime = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "PNG" : "image/PNG",
    "ico" : "image/ico",
    "css" : "text/css",
    "json": "application/json"
  };

//Página principal
const PRINCIPAL = fs.readFileSync('tienda.html', 'utf-8');

//Productos
const CAMISETA = fs.readFileSync('camiseta.html', 'utf-8');
const PANTALON = fs.readFileSync('pantalon.html', 'utf-8');
const VESTIDO = fs.readFileSync('vestido.html', 'utf-8');
const BOLSO = fs.readFileSync('bolso.html', 'utf-8');

//Página error
const ERROR = fs.readFileSync('error.html', 'utf-8');

//Formularios login
const LOGIN = fs.readFileSync('login.html', 'utf-8');
const LOGIN_WELL = fs.readFileSync('login_well.html', 'utf-8');
const LOGIN_BAD = fs.readFileSync('login_bad.html', 'utf-8');
const LOGIN_USER = fs.readFileSync('login-user.html', 'utf-8');

//Fichero JSON
const FICHERO_JSON = "tienda.json";

//Fichero JSON modificado
const FICHERO_JSON_MODIF = "tienda-modificada.json";

//Lectura del fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

const tienda = JSON.parse(tienda_json);

//Definición página principal
let principal;

//Definición contenido solicitado por el usuario
let requested_content;

//Lista usuarios registrados
let registered_users = [];
console.log("Usuarios registrados en la tienda");
tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.usuario);
    registered_users.push(element.usuario);
  });

//Lista productos disponibles
let available_products = [];
let lista_productos = [];
console.log("Productos disponibles en la tienda");
tienda[0]["productos"].forEach((element, index)=>{
  console.log("Producto " + (index + 1) + ": " + element.nombre + ", Precio: " + element.precio + ", Stock: " + element.stock);
  available_products.push([element.nombre, element.descripcion, element.precio, element.stock]);
  lista_productos.push(element.nombre);
});

//Creación del servidor
const server = http.createServer(function(req, res) {

  console.log("Petición recibida");
  
  //Cookie recibida
  const cookie = req.headers.cookie;

  let user;

  //Verificar si hay cookies
  if (cookie){
    console.log("Cookie: " + cookie);
    //array pares nombre-valor
    let par = cookie.split(";");

    //recorrer array pares
    par.forEach((element, index) => {
    let [nombre, valor] = element.split('=');

    //leer usuario
    if(nombre.trim() === 'user'){
      user = valor;
    }
    });

  }else {
    console.log("Petición sin cookie");
  }

  //Construir objeto url con la url de la solicitud
  const url = new URL(req.url, 'http://' + req.headers['host']);
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("Ruta: " + url.pathname); 
  console.log("Parametros: " + url.searchParams); 

  //leer parámetros
  let nombre = url.searchParams.get('nombre');
  console.log(" Nombre usuario: " + nombre);

  let content_type = mime["html"];

  //Analizar los recursos solicitados
  if(url.pathname == '/'){

    //Comprobar si el usuario está registrado
    if(user){
        //Añadir nombre a página principal
        requested_content = PRINCIPAL.replace('<h3></h3>', '<h3> Usuario: ' + user + '</h3>');
        requested_content = requested_content.replace('<b></b>',
                                '<a  class= "elemen" href="/comprar">Finalizar Comprar</a>');
        principal = requested_content;
    }else{
        //página principal con login
        requested_content = PRINCIPAL; 
        principal = requested_content;
    }

    //Login
    }else if (url.pathname == '/login'){

    //Comprobar si hay cookie del usuario
    if(user){
        //Si hay cookie
        console.log('Usuario ya registrado en la tienda online');
        requested_content = LOGIN_USER.replace("HTML_EXTRA", user );

    }else{
    console.log('Usuario no registrado en la tienda online');

    //Se envía formulario login
    requested_content = LOGIN;
    }
    ext = "html";

  //Procesar

  }else if (url.pathname == '/procesar'){
  //Se comprueba que el usuario está registrado en el JSON
    if ((available_products.includes(nombre))){

      console.log('User: ' + nombre);

      //Se asigna la cookie
      res.setHeader('Set-Cookie', "user=" + nombre );

      //Login OK
      console.log('Usuario registrado en la tienda');
      requested_content = WELL;
      requested_content = requested_content.replace("HTML_EXTRA", nombre);

    }else{
        requested_content = LOGIN_BAD;
    }

  }else{

    path = url.pathname.split('/');
    ext = '';
    if (path.length > 2){
      file = path[path.length-1]
      ext = file.split('.')[1]
      if(path.length == 3){

        if (path[1].startsWith('producto')){
          filename = file
        }else{
          filename = path[1] + '/' + file
        }
      }else{
        filename = path[2] + '/' + file
      }
    }else{
    filename = url.pathname.split('/')[1];
    ext = filename.split('.')[1]
  }
  

  //Lectura sincrona
  fs.readFile(filename, (err,data) => {

    //Fichero no encontrado
    if (err){

      //Lanza error
      res.writeHead(404,{'Content-Type': content_type})
      console.log("Petición rechazada: 404 Not Found");
      res.write(ERROR);
      res.end();
    }else{

      content_type = mime[ext];
      res.setHeader('Content-Type', content_type);
      console.log("Peticion Recibida, 200 OK");
      res.write(data);
      res.end();
    }     
  });
  return;
  }

  //Generar respuesta
  res.setHeader('Content-Type', content_type);
  res.write(requested_content);
  res.end();
});

  server.listen(PUERTO);
  console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO);