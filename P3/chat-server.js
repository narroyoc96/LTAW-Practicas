//Práctica 3: Websockets, Chat
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Cargar dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

let welcome_message = ">> ¡Hola, bienvenido al chat!";
let new_user = ">> Un nuevo usuario ha entrado en el chat";
let hello_message = ">> ¡Hola, disfruta en el chat!";
let date = new Date ();
var options = { year: 'numeric', month: 'long', day: 'numeric' };


let commands = "Los comandos especiales son: <br>" +
                ">> /help: Mostrará una lista con todos los comandos soportados <br>" + 
                ">> /list: Devolverá el número de usuarios conectados <br>" +
                ">> /hello: El servidor nos devolverá el saludo <br>" + 
                ">> /date: Nos devolverá la fecha <br>";

//Variable usuarios
let user_count = 0;

//Crear nueva aplicacion web
const app = express();

//rear un servidor, asociado a la app express
const server = http.Server(app);

//Crear servidor websockets, asociado servidor http
const io = socket(server);

//ENTRADA DE LA APLICACION WEB
//Definimos punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('<h2>¡Bienvenido al chat!</h2>' + '<p><a href="/chat.html">Unirse al chat</a></p>');
});

//Necesario para que el servidor le envíe al cliente la biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//Este directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//GESTION SOCKETS IO
//Evento: Nueva conexion recibida
io.on('connect', (socket) => {

  console.log('** NUEVA CONEXIÓN **'.yellow);
  user_count = user_count + 1;
  //Enviamos mensaje bienvenida
  socket.send(welcome_message);

  //Enviamos mensaje al resto de usuarios de que hay un nuevo usuario en el chat
  io.send(new_user);

  //Evento desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    user_count -=1;

 });

  //Mensaje recibido: Hacer eco
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    if (msg.startsWith('/')){
        if (msg == '/help'){
            console.log("Muestra una lista con todos los comandos soportados");
            msg = commands;
            socket.send(msg);
        }else if (msg == '/list'){
            console.log("Devuelve el número de usuarios conectados");
            msg = (">> Hay " + user_count + " usuarios conectados en este chat");
            socket.send(msg);
        }else if (msg == '/hello'){
            console.log("El servidor devuelve el saludo");
            msg = hello_message;
            socket.send(msg);
        } else if(msg == '/date'){
            console.log("Devuelve la fecha");
            msg = (">> La fecha actual es: " + date.toLocaleDateString("es-ES", options));
            socket.send(msg);
        }else{
            console.log("Comando no reconocido");
            msg = (">> Comando no reconocido, escribe /help para que te muestre los comandos permitidos en este chat");
            socket.send(msg);
        }
    }else{
        //Hacer eco
        io.send(msg);
    }
  });
});

//Lanzamos servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);