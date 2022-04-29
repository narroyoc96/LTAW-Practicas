//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_ = document.getElementById("msg_user");

//Variable sonido
let audio = new Audio('alerta.mp3');

//variable usuario
let user = 'Anónimo';

//variable para mostrar si el usuario esta escribiendo
let write = false;

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p>' + msg + '</p>';
  if(!msg.includes('está escribiendo..')){
    audio.play(); //sonará cuando se envie el mensaje
  }
});

//Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(user +  ": " + msg_entry.value);
    write = false;

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

//Si se está escribiendo se envía mensaje a los usuarios
msg_entry.oninput = () => {
  if(!write){
    write = true;
    socket.send(user + ' está escribiendo..');
  };
};

console.log(user)

//Cuando se introduce nombre usuario
msg_user.onchange = () => {
  if(msg_user.value){
    user = msg_user.value;
  }
};