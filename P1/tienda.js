//Práctica 1: Tienda de ropa
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const url = require('url');
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9000;

//Creación del servidor
const server = http.createServer((req, res) => {

    console.log("Petición recibida")

    //Construir objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log(url.pathname);

    //Se inicializa la variable recurso
    var resource = ""; 

    //Analizar el recurso solicitado
    if (url.pathname == '/') {
      resource += "/tienda.html"; //Si pide la página principal
    } else {
      resource += url.pathname; //Si pide otro recurso
    }

    //Obtención tipo recurso solicitado
    resource_type = resource.split(".")[1];
    resource = "." + resource;

    console.log("Recurso: " + resource);
    console.log("Extensión: " + resource_type);
});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 