const socket = io();

// Elements
const $messageInputForm = document.querySelector('form');
const $messageInput = document.querySelector('#message');
const $messageButton = document.querySelector('#submit');
const $locationSender = document.querySelector('#sendlocation');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#url-template').innerHTML;

// Options 
const { username,room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message',({message,createdAt}) => {
    const html = Mustache.render(messageTemplate,{
        message, createdAt: moment(createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage',({url,createdAt}) => {
    const html = Mustache.render(urlTemplate,{
        url, createdAt: moment(createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

$messageInputForm.addEventListener('submit',(event)=>{
    event.preventDefault();

    if(!$messageInput.value){ return; }

    $messageButton.setAttribute('disabled','disabled');

    socket.emit('sendMessage',$messageInput.value, (error) => { 
        $messageButton.removeAttribute('disabled');
        $messageInput.value = '';
        $messageInput.focus();
        if(error){
            return console.log(error);
        }
        console.log(`The message was delivered.`,message)
    });
});

$locationSender.addEventListener('click', () => {
    if(!navigator.geolocation){ return alert('Geolocation is not supported by your browser'); }

    $locationSender.setAttribute('disabled','disabled');

    navigator.geolocation.getCurrentPosition(({coords}) => {
        const {longitude,latitude} = coords;
        socket.emit('sendLocation',{longitude,latitude},(acknowledgement) => {
            console.log(acknowledgement);
            $locationSender.removeAttribute('disabled');
        });
    });
});

socket.emit('join',{ username,room });