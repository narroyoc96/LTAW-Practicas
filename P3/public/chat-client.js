//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_ = document.getElementById("msg_user");

//Variable sonido
let audio = new Audio('alerta.mp3');

//variable usuario
let user = 'Anónimo';

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p>' + msg + '</p>';
  audio.play();

});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(user +  ": " + msg_entry.value);

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

msg_user.onchange = () => {
  if(msg_user.value){
    user = msg_user.value;
  }
};