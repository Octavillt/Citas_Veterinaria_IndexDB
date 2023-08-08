// Creamos una variable sin valor para guardar la referencia a la base de datos.
let DB;

// Estamos definiendo las constantes que actuarán como referencias a los elementos de entrada en nuestro formulario.
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Estas constantes representan elementos de la interfaz de usuario (UI).
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando; // Esta variable de control se utilizará para comprobar si el usuario está editando una cita existente.

// Definimos la clase 'Citas', que manejará la lista de citas.
class Citas {
    constructor() {
        this.citas = []; // Almacenará todas las citas.
    }

    // Método para agregar una cita a la lista de citas.
    agregarCita(cita) {
        this.citas = [...this.citas, cita]; // Añade la nueva cita al final de la lista de citas existente.
    }

    // Método para eliminar una cita de la lista por su ID.
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id); // Filtra todas las citas, manteniendo solo las que no coinciden con el ID proporcionado.
    }

    // Método para actualizar una cita existente con una versión nueva.
    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita) // Reemplaza la cita con el mismo ID con la cita actualizada.
    }
}

// Definimos la clase 'UI', que manejará la interacción con la interfaz de usuario.
class UI {
    // Método para imprimir un mensaje de alerta en la interfaz de usuario.
    imprimirAlerta(mensaje, tipo) {
        // Crea un nuevo elemento 'div' para contener el mensaje.
        const divMensaje = document.createElement('div');
        // Agrega clases al div para estilizarlo.
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        // Determina el tipo de alerta (éxito o error) y añade la clase correspondiente.
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        // Asigna el mensaje de texto al contenido del div.
        divMensaje.textContent = mensaje;
        // Agrega el div al DOM, justo antes del elemento con la clase 'agregar-cita'.
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        // Programa la eliminación del mensaje de alerta después de 3.5 segundos.
        setTimeout(() => {
            divMensaje.remove();
        }, 3500);
    }

    // Método para imprimir todas las citas en la interfaz de usuario.
    imprimirCitas() {
        this.limpiarHTML();

        // Obtenemos un objectStore de la base de datos 'citas'.
        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function (e) {
            // console.log(e.target.result);
            const cursor = e.target.result;

            // Si el cursor existe, entonces hay citas para procesar.
            if (cursor) {
                // Usamos destructuring para obtener los valores del objeto de cita.
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;

                // Creamos un div para cada cita
                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;

                // Creamos y añadimos los elementos HTML para cada propiedad de la cita.
                // Aquí utilizamos template strings (`${}`) para incrustar las variables en el HTML.
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.innerHTML = `${mascota}`;

                // (El proceso se repite para cada propiedad)
                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

                // Agregamos un botón para eliminar la cita. Cuando se hace clic en este botón, se llama a la función eliminarCita.
                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'; // Contiene código SVG para el ícono

                // Agregamos un botón para editar la cita. Cuando se hace clic en este botón, se llama a la función cargarEdicion.
                const btnEditar = document.createElement('button');
                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>' // Contiene código SVG para el ícono

                // Agregamos todos los elementos al div de la cita
                divCita.appendChild(mascotaParrafo);
                // Agregar al HTML (El proceso se repite para cada elemento)
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar)
                divCita.appendChild(btnEditar)

                // Finalmente, agregamos la cita al contenedor de citas.
                contenedorCitas.appendChild(divCita);
                // Ve al Siguiente elemento
                cursor.continue();
            }// fin de if

        } // Fin de función de cursor...
    }

    // Método para eliminar todos los hijos del contenedor de citas, esencialmente limpiando la lista de citas mostrada.
    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// Instanciamos nuestras clases para su uso.
const ui = new UI();
const administrarCitas = new Citas();

window.onload = () => {
    // Inicializamos todos los eventos de escucha para el formulario y sus campos.
    eventListeners();

    crearDB();
}


function eventListeners() {
    /*
    Aquí se añaden manejadores de eventos 'input' a cada campo del formulario, de modo que cada vez que
    el usuario escribe en el campo, se almacena la entrada en la propiedad correspondiente del objeto 'citaObj'.
    */
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Esto es un objeto que almacenará temporalmente los datos de la cita a medida que el usuario los introduce.
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}
// Función que agrega datos al objeto de cita
function datosCita(e) {
    /*
    El evento "e" es el objeto del evento que contiene información
    sobre el evento que fue disparado, en este caso, un evento "input"
    "e.target" se refiere al elemento del DOM que disparó el evento, es decir,
    el campo de input que está siendo llenado en el formulario
    "e.target.name" nos da el nombre del elemento que disparó el evento
    es decir, el nombre del campo del input, este nombre coincide con la
    clave correspondiente en el objeto "citaObj"
    "e.target.value" es el valor actual del campo de input
    así que aquí estamos estableciendo el valor de la clave correspondiente
    en el objeto "citaObj" al valor actual del campo de input
    */
    citaObj[e.target.name] = e.target.value;
    /*
    De esta manera, mientras el usuario llena los campos de input en el formulario,
    los valores se están guardando en tiempo real en el objeto "citaObj"
    */
}
/*
Este es el manejador de eventos para el envío del formulario. Se encarga de validar los campos del formulario y
luego agregar una nueva cita o editar una cita existente, según corresponda.
*/
function nuevaCita(e) {
    // Aquí se detiene la recarga de la página debido a la presentación del formulario, se extraen los datos de la cita del objeto 'citaObj',
    e.preventDefault();

    // Extraer la Información del Objeto de Cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Se validan los campos del formulario para asegurar que no estén vacíos.
    if (mascota === '' || propietario === '' ||
        fecha === '' || hora === '' || sintomas === '') {
        // console.log('Campos Obligatorios');
        ui.imprimirAlerta('Todos los Campos son Obligatorios', 'error');
        return;
    }
    /*
    Luego, dependiendo de si el usuario está editando una cita existente o creando una nueva, 
    se llama a la función correspondiente para editar o agregar la cita y se muestra un mensaje de éxito.
    */
    if (editando) {
        // Pasar el Objeto de Cita a Edición
        administrarCitas.editarCita({ ...citaObj });
        // Creamos una transacción de lectura/escritura en la base de datos.
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        // Intentamos actualizar el registro citaObj en la base de datos.
        objectStore.put(citaObj);
        transaction.oncomplete = () => {
            // Si la transacción se completó correctamente, actualizamos la cita en administrarCitas y mostramos un mensaje.
            administrarCitas.editarCita({ ...citaObj });
            ui.imprimirAlerta('Guardado Correctamente...');
            // Cambiamos el texto del botón a 'Crear Cita' y reiniciamos la variable editando.
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
            editando = false;
        }

        // En caso de error, mostramos un mensaje en consola.
        transaction.onerror = () => {
            console.log('Hubo un errorr.')
        }

    } else {
        // Nuevo Registrando

        // Generar un ID único
        citaObj.id = Date.now();

        // Añade la nueva cita
        administrarCitas.agregarCita({ ...citaObj });

        // Creamos una transacción de lectura/escritura en la base de datos.
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        // Intentamos añadir el registro citaObj a la base de datos.
        objectStore.add(citaObj);

        // Si la transacción se completó correctamente, mostramos un mensaje.
        transaction.oncomplete = () => {
            // console.log('Cita agregada!');
            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se Agregó Correctamente...!');
        }


    }

    // Generar un ID Unico
    citaObj.id = Date.now();

    // Creando una Nueva Cita
    // console.log(citaObj);
    // administrarCitas.agregarCita({ ...citaObj });

    // Finalmente, se reinicia el objeto de cita y el formulario, y se imprime la lista actualizada de citas.

    // Reinicia el Objeto para la Validación
    reiniciarObjeto();

    // Reinicia el Formulario
    formulario.reset();

    // Mostrar el HTML de las Citas
    ui.imprimirCitas();
}

// Este método simplemente reinicia el objeto de cita a sus valores predeterminados.
function reiniciarObjeto() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

// Este método se llama cuando se hace clic en el botón 'eliminar' de una cita. Elimina la cita y muestra un mensaje de éxito.
function eliminarCita(id) {
    // Creamos una transacción de lectura/escritura en la base de datos.
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
    // Intentamos eliminar el registro con el ID proporcionado de la base de datos.
    objectStore.delete(id);

    // Si la transacción se completó correctamente, eliminamos la cita de administrarCitas y mostramos todas las citas restantes en el HTML.
    transaction.oncomplete = () => {
        console.log(`Cita  ${id} fue Eliminado...`);
        // administrarCitas.eliminarCita(id);
        ui.imprimirCitas()
    }

    // En caso de error, mostramos un mensaje en consola.
    transaction.onerror = () => {
        console.log('Hubo un Error...!');
    }
}

/* 
Este método se llama cuando se hace clic en el botón 'editar' de una cita. 
Rellena el formulario con los datos de la cita y cambia el formulario al modo de edición.
*/
function cargarEdicion(cita) {
    console.log(cita);
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Cambiar el Texto del Botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

// Aquí empieza el código para trabajar con IndexedDB.
function crearDB() {
    // Intentamos abrir la base de datos 'citas'. Si no existe, se crea automáticamente.
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay un error al abrir la base de datos, lo mostramos en consola.
    crearDB.onerror = function () {
        console.log('Hubo un Error...');
    }

    // Si la base de datos se abrió (o se creó) correctamente...
    crearDB.onsuccess = function () {
        console.log('Base de Datos Creada');
        // Guardamos la base de datos en la variable global DB para poder utilizarla después.
        DB = crearDB.result;
        // Mostramos todas las citas almacenadas en la base de datos.
        ui.imprimirCitas()
    }

    // Este método se ejecuta solo una vez, cuando la base de datos se crea por primera vez.
    crearDB.onupgradeneeded = function (e) {
        // Obtenemos la base de datos recién creada.
        const db = e.target.result;

        // Creamos un object store llamado 'citas' con 'id' como key path y auto incremento habilitado.
        const objectStore = db.createObjectStore('citas',
            {
                keyPath: 'id',
                autoIncrement: true
            });

        // Creamos índices para todos los campos de las citas para poder buscar citas por estos campos.
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('Database creada y lista');
    }
}

