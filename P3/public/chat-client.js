//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_nick = document.getElementById("nick");

//Variable nombre usuario
let nickname = 'Anonimo';
 

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p>' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(nickname + ': ' + msg_entry.value);

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}
console.log(nickname)

//-- Al introducir el botón del nick se le asigna
msg_nick.onchange = () => {
  if(msg_nick.value){
    nickname = msg_nick.value;
  }
  console.log(nickname);
}