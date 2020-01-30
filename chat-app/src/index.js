const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicdirpath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

app.use(express.static(publicdirpath));

io.on('connection', (socket) => {
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.emit('message',generateMessage(message));
        callback('Delivered');
    });

    socket.on('sendLocation', ({longitude,latitude},callback) => {
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback('Locations is shared!');
    });

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left!'));
    });

    socket.on('join', ({username,room}) => {
        socket.join(room);
        socket.to(room).emit('message',generateMessage('Welcome!'));
        socket.to(room).broadcast.emit('message',generateMessage(`${username} has joined!`));
    });
});

server.listen(port,()=>{console.log('Server is running on port')});