const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');
const sassMiddleware = require('node-sass-middleware')

io.on('connection', socket => {
  // Client wants to join room
  socket.on('room', request => {
    const {room, playerId} = request;

    // Let client know if they're the host
    io.in(room).clients((error, clients) => {
      const numOfClients = clients.length;

      socket.emit('host', (numOfClients === 0));

      // Join the client to the room
      socket.join(room);

      // Update client room counts
      io.sockets.in(room).emit('nPlayers', numOfClients + 1)
    });

  });

  // Client buzzed in
  socket.on('buzzed', request => {
    const room = Object.keys(socket.rooms)[1];

    // Emit to all sockets in room
    io.sockets.in(room).emit('buzzed', request);
  });

  // Host reset game
  socket.on('reset', () => {
    const room = Object.keys(socket.rooms)[1];

    io.sockets.in(room).emit('reset');
  })
});

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  includePaths: ['node_modules']
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pages/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
