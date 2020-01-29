const socket = io();

socket.on('message',(message) => {
    console.log(`Message: ${message}`);
});

const messageForm = document.querySelector('form');
const message = document.querySelector('#message');

messageForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(!message.value){
        return;
    }
    socket.emit('sendMessage',message.value);
});