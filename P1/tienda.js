//Práctica 1: Tienda de ropa
//Noelia Arroyo Castaño
//Asigantura: LTAW

//-- Importamos los módulos
const http = require('http');
const url = require('url');
const fs = require('fs');

//-- Puerto que vamos a utilizar
const PUERTO = 9000

//-- Mensaje 
console.log("Arrancando servidor...");

//-- Creamos servidor
const server = http.createServer((req,res) => {
    //-- Mensaje petición recibida
    console.log("Petición recibida");
    
    let myURL = url.parse(req.url, true);

  //-- Escribir en consola la ruta de nuestro recurso
  console.log("Recurso recibido: " + myURL.pathname);

  //-- Definir la variable fichero
  let filename = "";

  //-- Obtener la ruta (pathname)
  //-- Comprobar si la ruta es elemento raiz
  //-- Obtener fichero a devolver
  if (myURL.pathname == "/"){
    filename += "tienda.html";  //-- Abrir la pagina principal
  }else{
    filename += myURL.pathname.substr(1);  //-- Abrir el fichero solicitado
  }
//-- Extraer el tipo de mime que es la ruta
  //-- y quedarse con la extenson
  let ext = filename.split(".")[1];

  //Escribir tipo de mime solicitado
  console.log('Tipo de dato pedido: ' + ext);


  //Definir los tipos de mime
  const mimeType = {
    "html" : "text/html",
    "css"  : "text/css",
    "jpg"  : "image/jpg",
    "JPG"  : "image/jpg",
    "jpeg" : "image/jpeg",
    "png"  : "image/png",
    "gif"  : "image/gif",
    "ico"  : "image/x-icon"
  };

  //Asignar tipo de mime leer
  let mime = mimeType[ext];
  console.log("Tipo de mime solicitado: " + mime);

  fs.readFile(filename, function(err, data){
    
    //Devolver pagina de error personalizada, 404 NOT FOUND
    if ((err) || (filename == 'error.html')){
      res.writeHead(404, {'Content-Type': mime});
      console.log("Not found");
    }else{

      //Mandar mensaje 200 OK
      res.writeHead(200, {'Content-Type': mime});
      console.log("Peticion Atendida, 200 OK");
    } 
    //Enviar datos fichero solicitado  
    res.write(data);
    res.end();
  });
});

//Activar el servidor
server.listen(PUERTO);
console.log("Tienda de Moda Online. Escuchando en puerto: " + PUERTO);