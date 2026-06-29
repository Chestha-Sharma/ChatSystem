import {Server} from 'socket.io';
import http from 'http';
import express from 'express';



const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV !== 'development'
      ? 'https://chatsystem-1-zqf0.onrender.com'
      : 'http://localhost:5173',
    credentials: true,
  }
});

const userSocketMap = {};
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

io.on('connection',(socket)=>{
console.log("Socket connected",socket.id);

const userId = socket.handshake.query.userId;
if(userId){
    userSocketMap[userId] = socket.id;
}
//io.emit() used to send events to all the conneced cients
io.emit('getOnlineUsers',Object.keys(userSocketMap));

socket.on('disconnect',()=>{
    delete userSocketMap[userId];
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
    console.log("Socket disconnected",socket.id);
});
});




export { io , app , server};