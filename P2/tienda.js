//Práctica 2: Tienda de ropa mejorada
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9090;

//Definir tipos de mime
const mime_type = {
  "html" : "text/html",
  "css"  : "text/css",
  "js"   : "application/javascript",
  "jpg"  : "image/jpg",
  "JPG"  : "image/JPG",
  "jpeg" : "image/jpeg",
  "png"  : "image/png",
  "PNG"  : "image/PNG",
  "gif"  : "image/gif",
  "ico"  : "image/icon",
  "json" : "application/json",
};

//Página principal
const TIENDA = fs.readFileSync('tienda.html', 'utf-8');

//Página formulario
const LOGIN = fs.readFileSync('form-user.html', 'utf-8');

//Páginas productos camiseta
const ARTICULO1 = fs.readFileSync('articulo1.html', 'utf-8');
const ARTICULO2 = fs.readFileSync('articulo2.html', 'utf-8');
const ARTICULO3 = fs.readFileSync('articulo3.html', 'utf-8');
const ARTICULO4 = fs.readFileSync('articulo4.html', 'utf-8');
const ARTICULO5 = fs.readFileSync('articulo5.html', 'utf-8');
const ARTICULO6 = fs.readFileSync('articulo6.html', 'utf-8');
const ARTICULO7= fs.readFileSync('articulo7.html', 'utf-8');
const ARTICULO8 = fs.readFileSync('articulo8.html', 'utf-8');

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
const PEDIDO_OK = fs.readFileSync('pedido-realizado.html','utf-8');
const ADD_OK = fs.readFileSync('añadir.html', 'utf-8');

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


//Lista usuarios registrados.
let users_reg = [];
console.log("Lista de usuarios registrados");
console.log("-----------------------------");
tienda[1]["usuarios"].forEach((element, index)=>{
    console.log("Usuario " + (index + 1) + ": " + element.user);
    users_reg.push(element.user);
  });
console.log();

//Lista productos disponibles.
let productos_disp = [];
let product_list = [];
console.log("Lista de productos disponibles");
console.log("-----------------------------");
tienda[0]["productos"].forEach((element, index)=>{
  console.log("Articulo " + (index + 1) + ": " + element.nombre +
              ", Stock: " + element.stock + ", Precio: " + element.precio);
  productos_disp.push([element.nombre, element.descripcion, element.stock, 
                       element.precio]);
  product_list.push(element.nombre);
});
console.log();

//Analizar la cookie y devolver el nombre de usuario si existe
function get_user(req) {
  
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  //Si hay cookie, guardamos el usuario
  if (cookie) {
    //Obtenemos array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //Variable para guardar usuario
    let user;

    //Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {
      //Obtenemos los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //Lee el usuario solo si nombre = user
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //si user no asignada devuelve null
    return user || null;
  }
}

//Funcion para crear las cookies al añadir articulos al carrito
function add_carrito(req, res, producto) {
  const cookie = req.headers.cookie;

  if (cookie) {
    //Obteneos un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //Recorremos todos los pares nombre-valor
    pares.forEach((element, index) => {
      //Obtenemos los nombre y los valores por separado
      let [nombre, valor] = element.split('=');

      //Si nombre = carrito enviamos cookie de respuesta
      if (nombre.trim() === 'carrito') {
        res.setHeader('Set-Cookie', element + ':' + producto);
      }
    });
  }
}

//Obtener CARRITO
//-- Obtener el carrito
function get_carrito(req){
  //-- Leer la cookie recibida
  const cookie = req.headers.cookie;

  if (cookie){
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Variables para guardar los datos del carrito
    let carrito;
    let cam1 = '';
    let num_cam1 = 0;
    let cam2 = '';
    let num_cam2 = 0;
    let pan1 = '';
    let num_pan1 = 0;
    let pan2 = '';
    let num_pan2 = 0;
    let ves1 = '';
    let num_ves1 = 0;
    let ves2 = '';
    let num_ves2 = 0;
    let bol1 = '';
    let num_bol1 = 0;
    let bol2 = '';
    let num_bol2 = 0;

    pares.forEach((element, index) => {
      let [nombre, valor] = element.split('=');

      if (nombre.trim() === 'carrito') {
        productos = valor.split(':');
        productos.forEach((producto) => {
          if (producto == 'cam1'){
            if (num_cam1 == 0) {
              cam1 = productos_disp[0][0];
            }
            num_cam1 += 1;
          }else if (producto == 'cam2'){
            if (num_cam2 == 0){
              cam2= productos_disp[1][0];
            }
            num_cam2 += 1;
          }else if (producto == 'pan1'){
            if (num_pan1 == 0){
              pan1= productos_disp[2][0];
            }
            num_pan1 += 1;
          }else if (producto == 'pan2'){
            if (num_pan2 == 0){
              pan2= productos_disp[3][0];
            }
            num_pan2 += 1;
          }else if (producto == 'ves1'){
            if (num_ves1 == 0){
              ves1= productos_disp[4][0];
            }
            num_ves1 += 1;
          }else if (producto == 'ves2'){
            if (num_ves2 == 0){
              ves2= productos_disp[5][0];
            }
            num_ves2 += 1;
          }else if (producto == 'bol1'){
            if (num_bol1 == 0){
              bol1= productos_disp[6][0];
            }
            num_bol1 += 1;
          }else if (producto == 'bol2'){
            if (num_bol2 == 0){
              bol2= productos_disp[7][0];
            }
            num_bol2 += 1;
          }
        });

        if (num_cam1 != 0) {
          cam1 += ' x ' + num_cam1;
        }
        if (num_cam2 != 0) {
          cam2 += ' x ' + num_cam2;
        }
        if (num_pan1 != 0) {
          pan1 += ' x ' + num_pan1;
        }
        if (num_pan2 != 0) {
          pan2 += ' x ' + num_pan2;
        }
        if (num_ves1 != 0) {
          ves1 += ' x ' + num_ves1;
        }
        if (num_ves2 != 0) {
          ves2 += ' x ' + num_ves2;
        }
        if (num_bol1 != 0) {
          bol1 += ' x ' + num_bol1;
        }
        if (num_bol2 != 0) {
          bol2 += ' x ' + num_bol2;
        }
        carrito = cam1 + '<br>' + cam2 + '<br>' + pan1 + '<br>' + pan2 + '<br>' + ves1 + '<br>' + ves2 + '<br>' + bol1 + '<br>' + bol2 + '<br>';
      }
    });
    return carrito || null;
  }
}

var n;
//-- Funcion para obtener la pagina del producto
function get_producto(n, content) {
  content = content.replace('NOMBRE', productos_disp[n][0]);
  content = content.replace('DESCRIPCION', productos_disp[n][1]);
  content = content.replace('PRECIO', productos_disp[n][3]);
  
  return content;
}

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
    case 'articulo1':
      n = 0;
      content = ARTICULO1;
      content = get_producto(n, content);
      break;
      
    case 'articulo2': 
      n = 1;
      content = ARTICULO2;
      content = get_producto(n, content);
      break;

    case 'articulo3': 
      n = 2;
      content = ARTICULO3;
      content = get_producto(n, content);
      break;

    case 'articulo4': 
      n = 3;
      content = ARTICULO4;
      content = get_producto(n, content);
      break;

    case 'articulo5': 
      n = 4;
      content = ARTICULO5;
      content = get_producto(n, content);
      break;

    case 'articulo6': 
      n = 5;
      content = ARTICULO6;
      content = get_producto(n, content);
      break;

    case 'articulo7': 
      n = 6;
      content = ARTICULO7;
      content = get_producto(n, content);
      break;

    case 'articulo8': 
      n = 7;
      content = ARTICULO8;
      content = get_producto(n, content);
      break;

    //Añadir al carrito los distintos productos      
    case 'add_cam1':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'cam1');
      }else{
        res.setHeader('Set-Cookie', 'carrito=cam1');
        carrito_existe = true;
      }
      //Si se esta registrado se muestra el acceso al carrito,
      //-sino se muestra el acceso al login.
      user_registrado = get_user(req);
        if (user_registrado) {
          //Mostrar enlace formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          //Mostrar enlace formulario Login
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_cam2':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'cam2');
      }else{
        res.setHeader('Set-Cookie', 'carrito=cam2');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;
    
    case 'add_pan1':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'pan1');
      }else{
        res.setHeader('Set-Cookie', 'carrito=pan1');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_pan2':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'pan2');
      }else{
        res.setHeader('Set-Cookie', 'carrito=pan2');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_ves1':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'ves1');
      }else{
        res.setHeader('Set-Cookie', 'carrito=ves1');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_ves2':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'ves2');
      }else{
        res.setHeader('Set-Cookie', 'carrito=ves2');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_bol1':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'bol1');
      }else{
        res.setHeader('Set-Cookie', 'carrito=bol1');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;

    case 'add_bol2':
      content = ADD_OK;
      if (carrito_existe) {
        add_carrito(req, res, 'bol2');
      }else{
        res.setHeader('Set-Cookie', 'carrito=bol2');
        carrito_existe = true;
      }

      user_registrado = get_user(req);
        if (user_registrado) {
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/carrito" method="get"><input type="submit" value="Ver carrito"/></form>`);
        }else{
          content = ADD_OK.replace("HTML_EXTRA", 
                    `<form action="/login" method="get"><input type="submit" value="Login"/></form>`);
        }
      break;
      
    case 'carrito':
      content = CARRITO;
      let carrito = get_carrito(req);
      content = content.replace("PRODUCTOS", carrito);
      break;
    
    //Acceso formulario Login
    case 'login':
      content = FORMULARIO_LOGIN;
      break;
    
    //Procesar respuesta formulario login
    case 'procesarlogin':
      let usuario = url.searchParams.get('nombre'); //Obtener el nombre de usuario
      console.log('Nombre: ' + usuario);
      //Dar bienvenida solo a usuarios registrados.
      if (users_reg.includes(usuario)){
          console.log('El usuario esta registrado');
          //Asignar la cookie al usuario registrado.
          res.setHeader('Set-Cookie', "user=" + usuario);
          //Asignar la página web de login ok.
          content = LOGIN_OK;
          html_extra = usuario;
          content = content.replace("HTML_EXTRA", html_extra);
      }else{
          content = LOGIN_KO;
      }
      break;
    
    //Acceso formulario pedidos
    case 'pedido':
      content = FORMULARIO_PEDIDO;
      let pedido = get_carrito(req);
      content = content.replace("PRODUCTOS", pedido);
      break;
    
    //Procesar formulario pedidos
    case 'procesarpedido':
      //Guardar los datos del pedido en el fichero JSON
      //Primero obtenemos los parametros
      let direccion = url.searchParams.get('dirección');
      let tarjeta = url.searchParams.get('tarjeta');
      console.log("Dirección de envío: " + direccion + "\n" +
                  "Número de la tarjeta: " + tarjeta + "\n");
      //Obtener la lista de productos y la cantidad
      carro = get_carrito(req);
      producto_unidades = carro.split('<br>');
      console.log(producto_unidades);

      //Arrays para guardar los productos
      let list_productos = [];
      let list_unidades = [];

      //Obtener numero de productos adquiridos y actualizar stock
      producto_unidades.forEach((element, index) => {
        let [producto, unidades] = element.split(' x ');
        list_productos.push(producto);
        list_unidades.push(unidades);
      });
      
      //Actualizar la base de datos el stock de los productos.
      tienda[0]["productos"].forEach((element, index)=>{
        console.log("Producto " + (index + 1) + ": " + element.nombre);
        console.log(list_productos[index]);
        console.log();
        if (element.nombre == list_productos[index]){
          element.stock = element.stock - list_unidades[index];
        }
      });
      console.log();
      
      //Guardar datos del pedido en el registro tienda.json
      //si este no es nulo (null)
      if ((direccion != null) && (tarjeta != null)) {
        let pedido = {
          "user": get_user(req),
          "dirección": direccion,
          "tarjeta": tarjeta,
          "productos": producto_unidades
        }
        tienda[2]["pedidos"].push(pedido);
        //Convertir a JSON y registrarlo
        let myTienda = JSON.stringify(tienda, null, 4);
        fs.writeFileSync(FICHERO_JSON_OUT, myTienda);
      }
      //Confirmar pedido
      console.log('Pedido procesado correctamente');
      content = PEDIDO_OK;
      break;
    
    //Barra de búsqueda
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
    if (busqueda == 'camiseta1') {
      n = 0;
      content = ARTICULO1;
      content = get_producto(n, content);
    }else if(busqueda == 'camiseta2'){
      n = 1;
      content = ARTICULO2;
      content = get_producto(n, content);
    }else if(busqueda == 'pantalon1'){
      n = 2;
      content = ARTICULO3;
      content = get_producto(n, content);
    }else if(busqueda == 'pantalon2'){
      n = 3;
      content = ARTICULO4;
      content = get_producto(n, content);
    }else if(busqueda == 'vestido1'){
      n = 4;
      content = ARTICULO5;
      content = get_producto(n, content);
    }else if(busqueda == 'vestido2'){
      n = 5;
      content = ARTICULO6;
      content = get_producto(n, content);
    }else if(busqueda == 'bolso1'){
      n = 6;
      content = ARTICULO7;
      content = get_producto(n, content);
    }else if(busqueda == 'bolso2'){
      n = 7;
      content = ARTICULO8;
      content = get_producto(n, content);
    }
    break;

  case 'cliente.js':
    //-- Leer fichero javascript
    console.log("recurso: " + recurso);
    fs.readFile(recurso, 'utf-8', (err,data) => {
        if (err) {
            console.log("Error: " + err)
            return;
        } else {
          res.setHeader('Content-Type', mime_type["js"]);
          res.write(data);
          res.end();
        } 
    });
    
    return;
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

  //Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

  //Los datos del cuerpo son caracteres
  req.setEncoding('utf8');
  console.log(`Cuerpo (${cuerpo.length} bytes)`)
  console.log(` ${cuerpo}`);
  });

  //Esto solo se ejecuta cuando llega el final del mensaje de solicitud
  req.on('end', ()=> {
  //Generar respuesta
  res.setHeader('Content-Type', content_type);
  res.write(content);
  res.end()
  });

});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 