//Práctica 2: Tienda de ropa mejorada
//Noelia Arroyo Castaño
//Asigantura: LTAW

//Importando módulos
const http = require('http');
const fs = require('fs');

//Definición del puerto
const PUERTO = 9090;

//Página principal
const PRINCIPAL = fs.readFileSync('tienda.html', 'utf-8');

//Página formulario
const LOGIN = fs.readFileSync('form-user.html', 'utf-8');

//Páginas productos
const CAMISETA = fs.readFileSync('camiseta.html', 'utf-8');
const PANTALON = fs.readFileSync('pantalon.html', 'utf-8');
const VESTIDO = fs.readFileSync('vestido.html', 'utf-8');
const BOLSO = fs.readFileSync('bolso.html', 'utf-8');

//Página error
const ERROR = fs.readFileSync('error.html', 'utf-8');

//Página respuesta Bienvenido a la tienda y cliente desconocido
const LOGIN_OK = fs.readFileSync('form-respuest.html', 'utf-8');
const LOGIN_NOK = fs.readFileSync('form-error-respuest.html', 'utf-8');

//Página usuario dentro de la tienda
const LOGIN_USER = fs.readFileSync('user-login.html', 'utf-8');

//Página comprar formulario y respuesta
const COMPRAR = fs.readFileSync('comprar.html','utf-8');
const RESPUESTACOMP = fs.readFileSync('pedido-realizado.html', 'utf-8');

//Página carrito
const CARRO = fs.readFileSync('carrito.html', 'utf-8');

//JSON estructura de la tienda
const FICHERO_JSON = "tienda.json";

//Fichero JSON modificado
const FICHERO_JSON_OUT = "tienda-modificada.json";

//Lectura del fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);

//Definición página principal
let principal;

//Definición busqueda
let busqueda;

//Definición contenido solicitado por el usuario
let content;

//Arrays
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

  //Leer cookie recibida
  const cookie = req.headers.cookie;

  //guardamos usuario
  let user;

  //guardar carrito
  let carrito;

  //comprobacion de cookies
  if (cookie) {
    console.log("Cookie: " + cookie);
    //array pares nombre-valor
    let pares = cookie.split(";");

    //recorre array pares
    pares.forEach((element, index) => {
      //obtenen nombre y valor por separado
      let [nombre, valor] = element.split('=');

      //leer usuario
      if (nombre.trim() === 'user') {
        user = valor;
      }else if (nombre.trim() === 'carrito'){
        carrito = valor;

      }
    });
  } else {
    console.log("Petición sin cookie");
  }

  //Construir el objeto url con la url de la solicitud
  const url = new URL(req.url, 'http://' + req.headers['host']);  
  console.log("");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("Ruta: " + url.pathname); 
  console.log("Parametros: " + url.searchParams); 
  //Leer parámetros
  let nombre = url.searchParams.get('nombre');
  let password = url.searchParams.get('password');
  let direccion = url.searchParams.get('direccion');
  let tarjeta = url.searchParams.get('tarjeta');
  console.log(" Nombre usuario: " + nombre);
  console.log(" Password: " + password);
  console.log(" Direccion de envio: " + direccion);
  console.log(" Numero de Tarjeta de credito: " + tarjeta);

  //Comprobar si direccion y tarjeta es distinto de null
  if ((direccion != null) && (tarjeta != null)){
    //-- Añadirlos al pedido
    let pedido = {"usuario" : user,
                  "tarjeta" : tarjeta,
                  "direccion" : direccion,
                  "productos": list_productos}

    //Añadir pedido a la tienda
    tienda[2]["pedidos"].push(pedido)
 
    //Convertir variable a JSON
    let mytienda = JSON.stringify(tienda, null, 4);

    //Guardarmos en el fichero destino
    fs.writeFileSync(FICHERO_JSON_OUT, mytienda);
  };

  let content_type = mime_type["html"]; 

  //Analiza recursos solicitados
  if(url.pathname == '/'){
      //Comprobar si el usuario está registrado
      if(user){
        //Añadir nombre a página principal
        content = PRINCIPAL.replace('<h3></h3>', '<h3> Usuario: ' + user + '</h3>');
        content = content.replace('<b></b>',
                                '<a  class= "elemen" href="/comprar">Finalizar Comprar</a>');
        principal = content;
      }else{
        //Muestra la página principal con el login
        content = PRINCIPAL; 
        principal = content;
      }

  //Login
  }else if (url.pathname == '/login'){
    //Comprobar si hay cookie del usuario
    if(user){
      //Si hay cookie
      console.log('Usuario ya registrado en la tienda :)');
      content = LOGIN_USER.replace("USUARIO", user );
    }else{
    console.log('Usuario no registrado en la tienda :(');
    //Se envía formulario login
    content = LOGIN;
    }
    ext = "html";

  //Procesar
  }else if (url.pathname == '/procesar'){
      //Se comprueba que el usuario está registrado en el JSON
      if ((nombre_reg.includes(nombre)) && (password_reg.includes(password))){

        console.log('User: ' + nombre);

        //Se asigna la cookie
        res.setHeader('Set-Cookie', "user=" + nombre );

        //Login OK
        console.log('Usuario registrado');
        content = LOGIN_OK;
        html_extra = nombre;
        content = content.replace("HTML_EXTRA", html_extra);

      }else{
        content = LOGIN_NOK;
      }
  }else if (url.pathname == '/comprar'){
    content = COMPRAR.replace('PRODUCTOS', productos_carrito)

  }else if (url.pathname == '/finalizar') {
    content = RESPUESTACOMP;

  }else if (url.pathname == '/camiseta'){
    content = CAMISETA;
    for (i=0; i<3; i++) {
      content = content.replace('DESCRIPCION' + (i+1), descripcion["Camiseta"][i])
      content = content.replace('PRECIO' + (i+1), precio["Camiseta"][i])
    }
    
  }else if (url.pathname == '/pantalon'){
    content = PANTALON;
    for (i=0; i<3; i++){
      content = content.replace('DESCRIPCION' + (i+1), descripcion["Pantalon"][i])
      content = content.replace('PRECIO' + (i+1), precio["Pantalon"][i])
    }

  }else if (url.pathname == '/vestido'){
    content = VESTIDO;
    for (i=0; i<3; i++){
      content = content.replace('DESCRIPCION' + (i+1), descripcion["Vestido"][i])
      content = content.replace('PRECIO' + (i+1), precio["Vestido"][i])
    }

  }else if (url.pathname == '/bolso'){
    content = BOLSO;
    for (i=0; i<3; i++){
      content = content.replace('DESCRIPCION' + (i+1), descripcion["Bolso"][i])
      content = content.replace('PRECIO' + (i+1), precio["Bolso"][i])
    }

  }else if(url.pathname == '/camiseta/carrito' || url.pathname == '/pantalon/carrito' || url.pathname == '/vestido/carrito' || url.pathname == '/bolso/carrito'){
    producto_path = url.pathname.split('/')[1];
    if (producto_path == 'camiseta'){
      producto = 'Camiseta';
    }else if( producto_path == 'pantalon'){
      producto = 'Pantalon';
    }else if( producto_path == 'vestido'){
      producto = 'Vestido';
    }else{
      producto = 'Bolso';
    }

    productos.push(producto);
    let productos_sum = {};
    productos.forEach(function(numero){
      productos_sum[numero] = (productos_sum[numero] || 0) + 1;
    });

    //Variables devolver html
    let total = '';
    let total_cookie = '';
    let list_prod = [];
    //Productos sumados pasamos a string
    for (i=0; i<Object.keys(productos_sum).length; i++){
      prod = Object.keys(productos_sum)
      cant = Object.values(productos_sum)
      total += ('<h4>' + prod[i] + ': ' + cant[i] + '</h4>')
      total_cookie += (prod[i] + ': ' + cant[i] + ', ')
      pedido = {"producto": prod[i],
                "unidades": cant[i]}
      list_prod.push(pedido)
    }

    //Lista productos en el json
    list_productos = list_prod;
    console.log('PEDIDO:')
    console.log(list_productos)
    //-- Lista de productos para mostrar en la compra
    productos_carrito = total;

    //Asignamos cookie del pediod
    res.setHeader('Set-Cookie', "carrito=" + total_cookie);
    content = CARRO.replace('NINGUNO', total );
    content = content.replace('VOLVER', "<a class='button' href='/" + producto_path + "'>Volver atras</a>");

  } else if(url.pathname =='/productos'){
    console.log("Peticion de Productos!")
    content_type = mime_type["json"];

    //Leer los parámetros
    let param = url.searchParams.get('parametro');

    //Convertir vlores alphanumericos en string
    param = param.toUpperCase();

    console.log("  Param: " +  param);
 
    //Array de resultado de busquedas (neuvo)
    let result = [];
    for (let prod of productos_json) {
        //-- Pasar a mayúsculas
        prodU = prod.toUpperCase();

        if (prodU.startsWith(param)) {
            result.push(prod);
        }
    }
    //-- Imprimimos el aray de resultado de busquedas
    console.log(result);
    busqueda = result;
    //-- Pasamos el resultado a formato JSON con stringify
    content = JSON.stringify(result);

  }else if(url.pathname == '/buscar'){
    camiseta= ['camiseta1', 'camiseta2', 'camiseta3'];
    pantalon = ['pantalon1', 'pantalon2', 'pantalon3'];
    vestido = ['vestido1', 'vestido2', 'vestido3'];
    bolso = ['bolso1', 'bolso2', 'bolso3'];
    console.log(camiseta.includes(busqueda[0]))
    //-- Comprobamos que producto ha seleccionado y lo redirigimos
    if(camiseta.includes(busqueda[0])){
      content = CAMISETA;
      //-- Obtengo las descripciones y precios de cada producto
      for (i=0; i<3; i++){
        content = content.replace('DESCRIPCION' + (i+1), descripcion["camiseta"][i])
        content = content.replace('PRECIO' + (i+1), precio["camiseta"][i])
      }
    }else if(pantalon.includes(busqueda[0])){
      content = PANTALON;
      //-- Obtengo las descripciones y precios de cada producto
      for (i=0; i<3; i++){
        content = content.replace('DESCRIPCION' + (i+1), descripcion["pantalon"][i])
        content = content.replace('PRECIO' + (i+1), precio["pantalon"][i])
      }
    }else if(vestido.includes(busqueda[0])){
      content = VESTIDO;
      //-- Obtengo las descripciones y precios de cada producto
      for (i=0; i<3; i++){
        content = content.replace('DESCRIPCION' + (i+1), descripcion["vestido"][i])
        content = content.replace('PRECIO' + (i+1), precio["vestido"][i])
      }
    }else if(bolso.includes(busqueda[0])){
      content = BOLSO;
      //-- Obtengo las descripciones y precios de cada producto
      for (i=0; i<3; i++){
        content = content.replace('DESCRIPCION' + (i+1), descripcion["bolso"][i])
        content = content.replace('PRECIO' + (i+1), precio["bolso"][i])
      }

    }else{
      content = principal;
    }

  } else {
    path = url.pathname.split('/');
    ext = '';
    if (path.length > 2){
      file = path[path.length-1]
      ext = file.split('.')[1]
      if(path.length == 3){
        if (path[1].startsWith('producto')){
          filename = file
        }else{
          filename = path[1] + '/' + file
        }
       }else{
          filename = path[2] + '/' + file
       }
    }else{
      filename = url.pathname.split('/')[1];
      ext = filename.split('.')[1]
    }

    fs.readFile(filename, (err, data) => {
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

  //respuesta
  res.setHeader('Content-Type', content_type);
  res.write(content);
  res.end();

});

server.listen(PUERTO);
console.log("Servidor de la tienda online escuchando en puerto: " + PUERTO) 