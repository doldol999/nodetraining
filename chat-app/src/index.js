const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicdirpath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

app.use(express.static(publicdirpath));

io.on('connection', (socket) => {

    socket.on('join', (options, callback) => {
        const {error,user} = addUser({ id: socket.id, ...options });
        
        if(error){ return callback(error) }

        socket.join(user.room);
        socket.emit('message',generateMessage(undefined,'Welcome!'));
        socket.to(user.room).broadcast.emit('message',generateMessage(undefined,`${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    });

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        const user = getUser(socket.id);

        if(!user){ return callback('Unauthenticated user found!') }
        
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback('Delivered');
    });

    socket.on('sendLocation', ({longitude,latitude},callback) => {
        const user = getUser(socket.id);

        if(!user){ return callback('Unauthenticated user found!') }

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`));
        callback('Locations is shared!');
    });

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage(undefined,`${user.username} has left.`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });
});

server.listen(port,()=>{console.log('Server is running on port')});