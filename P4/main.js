//Práctica 3: Websockets, Chat
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Cargar dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const electron = require('electron');
const ip = require('ip');
const process = require('process');


const PUERTO = 9090;

let welcome_message = ">> ¡Hola, bienvenido al chat!";
let new_user = ">> Un nuevo usuario ha entrado en el chat";
let hello_message = ">> ¡Hola, disfruta en el chat!";
let desconected = '>> Un usuario abandonó el chat';
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
  path = __dirname + '/public/principal.html';
  res.sendFile(path);
  console.log("Solicitado acceso al chat");
});

//Necesario para que el servidor le envíe al cliente la biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//Este directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//funcion para los comandos especiales
function especial_commands(msg){
  let data;
  if(msg == '/help'){
    console.log('Muestra una lista con todos los comandos soportados');
    data = commands;
  }else if(msg == '/list'){
    console.log('Devuelve el número de usuarios conectados');
    data = ">> Hay " + user_count + " usuarios conectados en este chat";
  }else if(msg == '/hello'){
    console.log('El servidor devuelve el saludo');
    data = hello_message;
  }else if(msg == '/date'){
    console.log('Devuelve la fecha');
    data = ">> La fecha actual es: " + date.toLocaleDateString("es-ES", options);
  }else{
    console.log('Comando no reconocido');
    data = (">> Comando no reconocido, escribe /help para que te muestre los comandos permitidos en este chat");
  };
  return(data);
};

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
    io.send(desconected);
 });

  //Mensaje recibido: Hacer eco
  socket.on("message", (msg)=> {

    console.log("Mensaje Recibido!: " + msg.blue);
    msg_text = msg.split(' ')[1];
    if(msg_text.startsWith('/')){
      console.log("Recurso recibido!: " + msg_text.red);
      data = especial_commands(msg_text);
      socket.send(data);
    }else{
      //Reenviar a todos los clientes conectados
      io.send(msg);
    }
  });
});

//Lanzamos servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //-- Crear la ventana principal de nuestra aplicación
  win = new electron.BrowserWindow({
      width: 600,   //-- Anchura 
      height: 600,  //-- Altura

      //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  //win.setMenuBarVisibility(false)
  
  //-- Cargar interfaz gráfica en HTML
  let index = "index.html"
  win.loadFile(index);

  //-- Obtener elementos de la interfaz
  version_node = process.versions.node;
  version_electron = process.versions.electron;
  version_chrome = process.versions.chrome;
  arquitectura = process.arch;
  plataforma = process.platform;
  directorio = process.cwd();
  ip_address = ip.address();
  chat = "chat.html";

  let information = [version_node, version_electron, version_chrome, arquitectura, plataforma, directorio, ip_address, PUERTO, chat];

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('information', information);
  });
});

//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
console.log("-> Mensaje: " + msg);
io.send(msg);
});