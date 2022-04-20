//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const msg_nick = document.getElementById("nick");

//Variable nombre usuario
let nickname = 'Anonimo';

let write =false;


//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p>' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(nickname + ': ' + msg_entry.value);
    write = false;

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

//Al estar escribiendo se les manda un mensaje a los usuarios
msg_entry.oninput = () => {
  //-- Si esta escribiendo
  if(!write){
    user_write = true;
    socket.send('El usuario ' + nickname + ' esta escribiendo...');
  };
};
console.log(nickname)

//-- Al introducir el botón del nick se le asigna
msg_nick.onchange = () => {
  if(msg_nick.value){
    nickname = msg_nick.value;
  }
  console.log(nickname);
}