const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicdirpath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

app.use(express.static(publicdirpath));

const welcomeMessage = 'Welcome!';
io.on('connection', (socket) => {
    console.log('New Websocket Connection');
    socket.emit('message',welcomeMessage);
    socket.broadcast.emit('message','A new user has joined!');

    socket.on('sendMessage', (message) => {
        io.emit('message',message);
    });

    socket.on('disconnect',()=>{
        io.emit('message','A user has left!');
    });
});

server.listen(port,()=>{console.log('Server is running on port')});