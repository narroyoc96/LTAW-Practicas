//PROCESO RENDERIZADO
const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const node_version = document.getElementById("info1");
const chrome_version = document.getElementById("info2");
const electron_version = document.getElementById("info3");
const arquitectura = document.getElementById("info4");
const plataforma = document.getElementById("info5");
const directorio = document.getElementById("info6");
const num_usuarios = document.getElementById("users");
const dir_ip = document.getElementById("ip");
const boton = document.getElementById("btn_test");
const mensajes = document.getElementById("display");


//Mensajes recibidos del proceso MAIN

//-- Información del sistema
electron.ipcRenderer.on('informacion', (event, message) => {
    console.log("Recibido: " + message);

    //-- Extraemos cada dato
    node_version.textContent = message[0];
    chrome_version.textContent = message[1];
    electron_version.textContent = message[2];
    arquitectura.textContent = message[3];
    plataforma.textContent = message[4];
    directorio.textContent = message[5]
    url = ("http://" + message[6] + ":" + message[7] + "/" + message[8]);
    dir_ip.textContent = url;
});

//-- Numero de usuarios
electron.ipcRenderer.on('users', (event, message) => {
    console.log("Recibido: " + message);
    num_usuarios.textContent = message;
});

//-- Mensajes de los clientes
electron.ipcRenderer.on('msg_client', (event, message) => {
    console.log("Recibido: " + message);
    mensajes.innerHTML += message + "<br>";
});

//Mensajes enviados al proceso MAIN
boton.onclick = () => {
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Holaaaaa :)");
};  
