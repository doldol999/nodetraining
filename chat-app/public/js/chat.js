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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options 
const { username,room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New Message Element 
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMesageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMesageMargin;

   // Visible Height
   const visibleHeight = $messages.offsetHeight;

   // Height of message container
   const containerHeight = $messages.scrollHeight;

   // How far have I scrolled?
   const scrollOffset = $messages.scrollTop + visibleHeight;

   if(containerHeight - newMessageHeight <= scrollOffset){
       $messages.scrollTop = $messages.scrollHeight;
   }
}

socket.emit('join',{ username,room }, (error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
});

socket.on('message',({username,message,createdAt}) => {
    const html = Mustache.render(messageTemplate,{
        username,message, createdAt: moment(createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

socket.on('locationMessage',({username,url,createdAt}) => {
    const html = Mustache.render(urlTemplate,{
        username, url, createdAt: moment(createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{ room,users });
    document.querySelector('#sidebar').innerHTML = html;
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