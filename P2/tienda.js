//Práctica 1: Tienda de ropa
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const url = require('url');
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9090;

//Creación del servidor
const server = http.createServer(function(req, res) {

  console.log("Petición recibida");

  //Construir objeto url con la url de la solicitud
  let url = new URL(req.url, 'http://' + req.headers['host']);
  console.log("Esta es la URL solicitada:" + url.href);

  //Se inicializa la variable recurso
  let resource = ""; 
  
  //Analizar el recurso solicitado
  if (url.pathname == '/') {
    resource += "/tienda.html"; //Si pide la página principal
  } else if(url.pathname == "/favicon.icon"){
    file = 'ico.ico'
  } else {
    resource += url.pathname; //Si pide otro recurso
  }

  //Obtención tipo recurso solicitado
  resource_type = resource.split(".")[1]; //la extension
  resource = "." + resource;

  console.log("Recurso: " + resource);
  console.log("Extensión: " + resource_type);


  //Definicion de todos los tipos de archivo
  const mime = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "PNG" : "image/PNG",
    "ico" : "image/ico",
    "css" : "text/css",
  };
  //Extrae tipo mime
  let mime_type = mime[resource_type];
  console.log("Tipo de mime asociado es:" + mime_type);

  //Lectura sincrona
  fs.readFile(resource, function(err,data) {
    //Fichero no encontrado
    if (err){
      //Lanza error
      res.writeHead(404,{'Content-Type': 'text/html'})
      console.log("Petición rechazada: 404 Not Found");
      resource = "html/error.html";
      data = fs.readFileSync(resource);
      res.write(data);
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': mime});
      console.log("Peticion Recibida, 200 OK");
      res.write(data);
      res.end();
    }     
  });
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 