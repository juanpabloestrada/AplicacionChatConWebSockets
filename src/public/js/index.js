const socket = io();

//Creacion de elementos del DOM y variables auxiliares
let user; // Este "user" será con el que el cliente se identificara para saber quien escribio el mensaje
let chatBox = document.getElementById('chatbox'); // Obtener la referencia del cuadro conde se escribirá

//Alerta de identificación
Swal.fire({
    title:"Identifícate",
    input:'text', // Indicamos que el clinete necesita escribir un texto para poder avanzar en la alerta
    text:"Ingresa tu usuario para poder identificarte en el chat",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar'
        // Esta validacion ocurre si el usuario decide dar en "continuar" sin haber colocado un nombre de usuario
    },
    allowOutsideClick: false // Impide que el usuario salga de la alerta al dar "clik" fuera de la alerta
}).then(result => {
    user = result.value;
    document.getElementById('username').textContent = user;
    socket.emit('userAuthenticated', {user: user});
    // una vez que el usuario se identifica, lo asignamos a la variable user
});

//Event listener para el imput del chat
chatBox.addEventListener('keyup', (evt) => {
    if (evt.key === 'Enter') { // El mensaje se enviará cuando el usuario apriete "Enter" en la caja del chat
        if(chatBox.value.trim().length) { // Corroboramos que el mensaje no esté vacio o solo contenga espacios
            socket.emit('message', {user: user, message : chatBox.value}); // Emitimos nuestro primer evento.
            chatBox.value = '';
        }
    }
})

// Escuchar el evento 'messageLogs' en el cliente y actualizar la lista de mensajes
socket.on('messageLogs', (data) => {
    let log = document.getElementById('messageLogs');
    let messagesHtml = "";
    data.forEach(message => {
        messagesHtml += `${message.user} dice: ${message.message}<br>`;
    });
    log.innerHTML = messagesHtml;
});

// Escuchar si se conecta un usuario nuevo
socket.on('newUserConnected', newUser => {
    // Mostrar una notificacion usando SweetAlert2
    Swal.fire({
        text: "Nuevo usuario conectado",
        toast: true,
        position: 'top-right',
        icon: 'info',
        title: `${newUser.user} se ha unido al chat`,
        showConfirmButton: false,
        timer: 5000
    });
});