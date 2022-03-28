//Práctica 2: Tienda de ropa mejorada
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9090;

//Página principal
const TIENDA = fs.readFileSync('tienda.html', 'utf-8');

//Página formulario
const LOGIN = fs.readFileSync('form-user.html', 'utf-8');

//Páginas productos
const CAMISETA = fs.readFileSync('camiseta.html', 'utf-8');
const PANTALON = fs.readFileSync('pantalon.html', 'utf-8');
const VESTIDO = fs.readFileSync('vestido.html', 'utf-8');
const BOLSO = fs.readFileSync('bolso.html', 'utf-8');

//Página error
const ERROR = fs.readFileSync('error.html', 'utf-8');

//-- Cargar pagina web del formulario 
const FORMULARIO_LOGIN = fs.readFileSync('form-user.html','utf-8');
const FORMULARIO_PEDIDO = fs.readFileSync('pedido.html','utf-8');

//Página respuesta Bienvenido a la tienda y cliente desconocido
const LOGIN_OK = fs.readFileSync('form-respuest.html', 'utf-8');
const LOGIN_KO = fs.readFileSync('form-error-respuest.html', 'utf-8');

//Página usuario dentro de la tienda
const LOGIN_USER = fs.readFileSync('user-login.html', 'utf-8');

//Página comprar formulario y respuesta
const PEDIDO_OK = fs.readFileSync('pedido.html','utf-8');
const ADD_OK = fs.readFileSync('pedido-realizado.html', 'utf-8');

//Página carrito
const CARRITO = fs.readFileSync('carrito.html', 'utf-8');
let carrito_existe = false;
let busqueda; //Definición busqueda

//JSON estructura de la tienda
const FICHERO_JSON = "tienda.json";

//Fichero JSON modificado
const FICHERO_JSON_OUT = "tienda-modificada.json";

//Lectura del fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);


//Arrays usuarios
let nombre_reg = [];
let password_reg = [];

//Lista de usuarios registrados
let usuarios_reg = tienda[1]["usuarios"];

for (i = 0; i < usuarios_reg.length; i++){
  nombre_reg.push(usuarios_reg[i]["usuario"]);
  password_reg.push(usuarios_reg[i]["password"]);
};

//Array productos de la tienda
let productos = [];
let list_productos;
let productos_carrito;

// Obtenemos los productos del json
prod = tienda[0]["productos"]
//Array productos del json
let productos_json = []
//Array descripciones
let descripcion = [];
//Array precios
let precio = [];
for (i=0; i<prod.length; i++){
  key = Object.keys(prod[i])[0]
  producto = prod[i]
  list = producto[key]
  descripcion[key] = [];
  precio[key] = [];
  for (j=0; j<list.length; j++){
    nombre = list[j]["nombre"]
    descrip = list[j]["descripcion"]
    prec = list[j]["precio"]
    productos_json.push(nombre);
    descripcion[key].push(descrip);
    precio[key].push(prec)
  }
}
console.log(productos_json)

//-- Analizar la cookie y devolver el nombre de usuario si existe,
//-- null en caso contrario.
function get_user(req) {
  
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  //-- Si hay cookie, guardamos el usuario
  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario solo si nombre = user
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //-- si user no esta asignada se devuelve null
    return user || null;
  }
}

//-- Funcion para crear las cookies al añadir articulos al carrito.
function add_al_carrito(req, res, producto) {
  const cookie = req.headers.cookie;

  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Si nombre = carrito enviamos cookie de respuesta
      if (nombre.trim() === 'carrito') {
        res.setHeader('Set-Cookie', element + ':' + producto);
      }
    });
  }
}

//-- Obtener el carrito
function get_carrito(req){
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  if (cookie){
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variables para guardar los datos del carrito
    let carrito;
    let camiseta = '';
    let num_camiseta = 0;
    let pantalon = '';
    let num_pantalon = 0;
    let vestido = '';
    let num_vestido = 0;
    let bolso = '';
    let num_bolso = 0;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //-- Obtener los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //-- Si nombre = carrito registramos los articulos
      if (nombre.trim() === 'carrito') {
        productos = valor.split(':');
        productos.forEach((producto) => {
          if (producto == 'camiseta'){
            if (num_camiseta == 0) {
              camiseta = productos[0][0];
            }
            num_camiseta += 1;
          }else if (producto == 'pantalon'){
            if (num_pantalon == 0){
              pantalon= productos[1][0];
            }
            num_pantalon += 1;
          }else if (producto == 'vestido'){
            if (num_vestido == 0){
              vestido = productos[2][0];
            }
            num_vestido+= 1;
          }else if (producto == 'bolso'){
            if (num_bolso== 0){
              bolso = productos[3][0];
            }
            num_bolso += 1;
          }
        });

        if (num_camiseta != 0) {
          camiseta += ' x ' + num_camiseta;
        }
        if (num_pantalon != 0) {
          pantalon += ' x ' + num_pantalon;
        }
        if (num_vestido != 0) {
          vestido += ' x ' + num_vestido;
        }
        if (num_bolso != 0) {
          bolso += ' x ' + num_bolso;
        }
        carrito = camiseta + '<br>' + pantalon + '<br>' + vestido + '<br>' + bolso + '<br>';
      }
    });

    //-- Si esta vacío se devuelve null
    return carrito || null;
  }
}

var n;
//-- Funcion para obtener la pagina del producto
function get_producto(n, content) {
  content = content.replace('NOMBRE', productos[n][0]);
  content = content.replace('DESCRIPCION', productos[n][1]);
  content = content.replace('PRECIO', productos[n][3]);
  
  return content;
}

//-- Definir los tipos de mime
const mime_type = {
  "html" : "text/html",
  "css"  : "text/css",
  "js"   : "application/javascript",
  "jpg"  : "image/jpg",
  "JPG"  : "image/jpg",
  "jpeg" : "image/jpeg",
  "png"  : "image/png",
  "PNG" : "image/PNG",
  "ico"  : "image/ico",
  "json" : "application/json",
};

//Creación del servidor
const server = http.createServer((req, res) => {

  console.log("Petición recibida");

  //Construir el objeto url con la url de la solicitud
  const url = new URL(req.url, 'http://' + req.headers['host']);  
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log(" Ruta: " + url.pathname); 
  console.log(" Parametros: " + url.searchParams); 

  //Leer parámetros
  let nombre = url.searchParams.get('nombre');
  let password = url.searchParams.get('password');
  let direccion = url.searchParams.get('direccion');
  let tarjeta = url.searchParams.get('tarjeta');
  console.log(" Nombre usuario: " + nombre);
  console.log(" Password: " + password);
  console.log(" Direccion de envio: " + direccion);
  console.log(" Numero de Tarjeta de credito: " + tarjeta);

  //-- Variables para el mensaje de respuesta
  let content_type = mime_type["html"];
  let content = "";

  //-- Leer recurso y eliminar la / inicial
  let recurso = url.pathname;
  recurso = recurso.substr(1); 


  switch (recurso) {
    case '':
      console.log("Página principal");
      content = TIENDA;
      let user = get_user(req);
      if (user) {
        content = TIENDA.replace("HTML_EXTRA", "<h2>Usuario: " + user + "</h2>" + `<form action="/carrito" method="get"><input type="submit" value="Carrito"/></form>`);

      } else {
        content = TIENDA.replace("HTML_EXTRA", `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);

      }
      break;

    //Páginas productos
    case 'camiseta':
      n = 0;
      content = CAMISETA;
      content = get_producto(n, content);
      break;
      
    case 'pantalon': 
      n = 1;
      content = PANTALON;
      content = get_producto(n, content);
      break;

    case 'vestido':
      n = 2;
      content = VESTIDO;
      content = get_producto(n, content);
      break;

    case 'bolso': 
      n = 3;
      content = BOLSO;
      content = get_producto(n, content);
      break;

    //-- Añadir al carrito los distintos productos      
    case 'add_camiseta':
      content = ADD_OK;
      if (carrito_existe) {
        add_al_carrito(req, res, 'camiseta');
      }else{
        res.setHeader('Set-Cookie', 'carrito=camiseta');
        carrito_existe = true;
      }
      //-- Si se esta registrado se muestra el acceso al carrito,
      //-- sino se muestra el acceso al login.
      user_registrado = get_user(req);
        if (user_registrado) {
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_pantalon':
      content = ADD_OK;
      if (carrito_existe) {
        add_al_carrito(req, res, 'pantalon');
      }else{
        res.setHeader('Set-Cookie', 'carrito=pantalon');
        carrito_existe = true;
      }
      //-- Si se esta registrado se muestra el acceso al carrito,
      //-- sino se muestra el acceso al login.
      user_registrado = get_user(req);
        if (user_registrado) {
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;
    
    case 'add_vestido':
      content = ADD_OK;
      if (carrito_existe) {
        add_al_carrito(req, res, 'vestido');
      }else{
        res.setHeader('Set-Cookie', 'carrito=vestido');
        carrito_existe = true;
      }
      //-- Si se esta registrado se muestra el acceso al carrito,
      //-- sino se muestra el acceso al login.
      user_registrado = get_user(req);
        if (user_registrado) {
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_bolso':
      content = ADD_OK;
      if (carrito_existe) {
        add_al_carrito(req, res, 'bolso');
      }else{
        res.setHeader('Set-Cookie', 'carrito=bolso');
        carrito_existe = true;
      }
      //-- Si se esta registrado se muestra el acceso al carrito,
      //-- sino se muestra el acceso al login.
      user_registrado = get_user(req);
        if (user_registrado) {
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          //-- Mostrar el enlace al formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;
    
    case 'carrito':
      content = CARRITO;
      let carrito = get_carrito(req);
      content = content.replace("PRODUCTOS", carrito);
      break;
    
    //-- Acceso al formulario Login
    case 'login':
      content = FORMULARIO_LOGIN;
      break;
    
    //-- Procesar la respuesta del formulario login
    case 'procesarlogin':
      //-- Obtener el nombre de usuario
      let usuario = url.searchParams.get('nombre');
      console.log('Nombre: ' + usuario);
      //-- Dar bienvenida solo a usuarios registrados.
      if (nombre_reg.includes(usuario)){
          console.log('El usuario esta registrado');
          //-- Asignar la cookie al usuario registrado.
          res.setHeader('Set-Cookie', "user=" + usuario);
          //-- Asignar la página web de login ok.
          content = LOGIN_OK;
          html_extra = usuario;
          content = content.replace("HTML_EXTRA", html_extra);
      }else{
          content = LOGIN_KO;
      }
      break;
    
    //-- Acceso al formulario de pedidos
    case 'pedido':
      content = FORMULARIO_PEDIDO;
      let pedido = get_carrito(req);
      content = content.replace("PRODUCTOS", pedido);
      break;
    
    //-- Procesar el formulario de pedidos
    case 'procesarpedido':
      //-- Guardar los datos del pedido en el fichero JSON
      //-- Primero obtenemos los parametros
      let direccion = url.searchParams.get('dirección');
      let tarjeta = url.searchParams.get('tarjeta');
      console.log("Dirección de envío: " + direccion + "\n" +
                  "Número de la tarjeta: " + tarjeta + "\n");
      //-- Obtener la lista de productos y la cantidad
      carro = get_carrito(req);
      producto_unidades = carro.split('<br>');
      console.log(producto_unidades);

      //-- Arrays para guardar los productos adquiridos
      let list_productos = [];
      let list_unidades = [];

      //-- Obtener numero de productos adquiridos y actualizar stock
      producto_unidades.forEach((element, index) => {
        let [producto, unidades] = element.split(' x ');
        list_productos.push(producto);
        list_unidades.push(unidades);
      });
      
      //-- Actualizar en la base de datos el stock de los productos.
      tienda[0]["productos"].forEach((element, index)=>{
        console.log("Producto " + (index + 1) + ": " + element.nombre);
        console.log(list_productos[index]);
        console.log();
        if (element.nombre == list_productos[index]){
          element.stock = element.stock - list_unidades[index];
        }
      });
      console.log();
      
      //-- Guardar datos del pedido en el registro tienda.json
      //-- si este no es nulo (null)
      if ((direccion != null) && (tarjeta != null)) {
        let pedido = {
          "user": get_user(req),
          "dirección": direccion,
          "tarjeta": tarjeta,
          "productos": producto_unidades
        }
        tienda[2]["pedidos"].push(pedido);
        //-- Convertir a JSON y registrarlo
        let myTienda = JSON.stringify(tienda, null, 4);
        fs.writeFileSync(FICHERO_JSON_PRUEBA, myTienda);
      }
      //-- Confirmar pedido
      console.log('Pedido procesado correctamente');
      content = PEDIDO_OK;
      break;
    
    //-- Barra de búsqueda
    case 'productos':
      console.log("Peticion de Productos!")
      content_type = mime_type["json"]; 

      //-- Leer los parámetros
      let param1 = url.searchParams.get('param1');

      param1 = param1.toUpperCase();

      console.log("  Param: " +  param1);

      let result = [];

      for (let prod of product_list) {

          //-- Pasar a mayúsculas
          prodU = prod.toUpperCase();

          //-- Si el producto comienza por lo indicado en el parametro
          //-- meter este producto en el array de resultados
          if (prodU.startsWith(param1)) {
              result.push(prod);
          }
          
      }
      console.log(result);
      busqueda = result;
      content = JSON.stringify(result);
      break;
    
  case 'buscar':
    if (busqueda == 'Camiseta') {
      n = 0;
      content = CAMISETA;
      content = get_producto(n, content);
    }else if(busqueda == 'Pantalon'){
      n = 1;
      content = PANTALON;
      content = get_producto(n, content);
    }else if(busqueda == 'Vestido'){
      n = 2;
      content = VESTIDO;
      content = get_producto(n, content);
    }else if(busqueda == 'Bolso'){
      n = 3;
      content = BOLSO;
      content = get_producto(n, content);
    }
    break;

  default:
    path = url.pathname.split('/');
    ext = '';
    if (path.length > 2){
        file = path[path.length-1]
        ext = file.split('.')[1]
        if(path.length == 3){
            if (path[1].startsWith('producto')){
                recurso = file
            }else{
                recurso = path[1] + '/' + file
            }
        }else{
            recurso = path[2] + '/' + file
        }
    }else{
        recurso = url.pathname.split('/')[1];
        ext = recurso.split('.')[1]
    }

    fs.readFile(recurso, (err, data) => {
      //
      //Devolver pagina de error, 404 NOT FOUND
      if (err){
        res.writeHead(404, {'Content-Type': content_type});
        res.write(ERROR);
        res.end();
      }else{
        //Todo correcto, 200 OK
        content_type = mime_type[ext];
        res.setHeader('Content-Type', content_type);
        res.write(data);
        res.end();
      } 
    });
    return;
  }

  //-- Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

  //-- Los datos del cuerpo son caracteres
  req.setEncoding('utf8');
  console.log(`Cuerpo (${cuerpo.length} bytes)`)
  console.log(` ${cuerpo}`);
  });

  //-- Esto solo se ejecuta cuando llega el final del mensaje de solicitud
  req.on('end', ()=> {
  //-- Generar respuesta
  res.setHeader('Content-Type', content_type);
  res.write(content);
  res.end()
  });

});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 