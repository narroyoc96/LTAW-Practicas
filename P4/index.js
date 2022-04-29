//const { protocol } = require('electron');
const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const version_node = document.getElementById("info1");
const version_electron = document.getElementById("info2");
const  version_chrome = document.getElementById("info3");
const arquitectura = document.getElementById("info4");
const directorio = document.getElementById("info5");
const ip_address = document.getElementById("info6");
const user_count = document.getElementById("users");

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('information', (event, message) => {
    console.log("Recibido: " + message);
    version_node.textContent = message[0];
    version_electron.textContent = message[1];
    version_chrome.textContent = message[3];
    arquitectura.textContent = message[4];
    directorio.textContent = message[5];
    ip_address.textContent = message[6];
    puerto.textContent = message[7];
    index = message[8];

    url = ("http://" + ip_address.textContent + ":" + puerto.textContent + "/" + index);

});

//-- Mensajes recibido del proceso MAIN
electron.ipcRenderer.on('users', (event, message) => {
    console.log("Recibido: " + message);
    user_count.textContent = message;
});

electron.ipcRenderer.on('msg', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + "<br>";
});

btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
}