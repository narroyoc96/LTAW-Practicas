//Práctica 4: Electron, Chat
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

//Variable acceder ventana principal (global módulo principal)
let win = null;

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

  //Enviamos numero usuarios al renderer
  win.webContents.send('users', user_count);

  //Enviamos mensaje bienvenida
  socket.send(welcome_message);

  //Enviamos mensaje al resto de usuarios de que hay un nuevo usuario en el chat
  io.send(new_user);

  //Enviamos al render mensaje conexion
  win.webContents.send('msg_client', welcome_message);

  //Evento desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    user_count -=1;

    //Enviamos numero usuarios al renderer
    win.webContents.send('users', user_count);

    io.send(desconected);

    //Enviamos al render mensaje desconexion
    win.webContents.send('msg_client', desconected);
 });

  //Mensaje recibido: Hacer eco
  socket.on("message", (msg)=> {

    console.log("Mensaje Recibido!: " + msg.blue);

    //Enviamos al render
    win.webContents.send('msg_client', msg);

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

//CREANDO APP ELECTRON
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //Creamos ventana principal de nuestra app
  win = new electron.BrowserWindow({
      width: 600,  //-- Anchura 
      height: 600,  //-- Altura

      //Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
    }

  });

  //Cargamos la interfaz gráfica HTML
  let fichero = "index.html"
  win.loadFile(fichero);

  //Obtenemos informacion a enviar al renderizador
  //Obtenemos las versiones
  node_version = process.versions.node;
  chrome_version= process.versions.chrome;
  electron_version = process.versions.electron;
  //Obtenemos arquitectura
  arquitectura = process.arch;
  //Obtenemos plataforma
  plataforma = process.platform;
  //Obtenemos directorio
  directorio = process.cwd();
  //Obtenemos direccion IP
  dir_ip = ip.address();

  //Reagrupamos datos a enviar
  let datos = [node_version, chrome_version, electron_version, arquitectura, plataforma, directorio,
              dir_ip, PUERTO, fichero];

  //Esperar a que la página se cargue  con el evento 'ready-to-show'
  win.on('ready-to-show', () => {
      console.log("Enviando datos...");
      //send(nombre evento, mensaje)
      win.webContents.send('informacion', datos);
  });

});

//MENSAJES RECIBIDOS
//Esperar a recibir los mensajes de botón apretado (Mensaje prueba)
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
  //-- Reenviarlo a todos los clientes conectados
  io.send(msg);
});