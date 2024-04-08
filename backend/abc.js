// app.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const idSockRoutes = require('./routes/idsockroute')
const dbConfig = require('./db');
 const kycroutee=require('./routes/kycRoutee')
const vehicleroute = require('./routes/vehicleroutes');
const userroutes = require('./routes/userroutes'); // Import userroutes
const bookingRoute = require('./routes/bookingRoute'); // Import bookingRoute
const bodyParser = require('body-parser');
const anothers = require('./routes/anothersroute');
const localStorageDataRoute = require('./routes/LocalStorageDataRoute');
const kycroute = require('./routes/kycRoute');
const tagRoute = require('./routes/Taggy');
const adminRoute = require('./routes/adminroute');
const cors = require('cors');
const recommendationRouter = require('./routes/systemroute');
const path = require('path');
const messageRoute = require('./routes/messageRoute'); // Add messageRoute
const Message = require('../backend/routes/messageModell'); // Import the Message model
const interaction=require('../backend/routes/userIntercationRoute')
const app = express();
const server = http.createServer(app);

// Initialize socket.io and pass the server instance
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }
});

app.use(cors());
app.use(express.json());

// Mount the vehicleRoute handler under /api/vehicles path
app.use('/api', vehicleroute);
app.use('/api/bookings', bookingRoute); // Use bookingRoute
app.use('/api/anothers', anothers);
app.use('/api/users', userroutes); // Use userroutes
app.use('/api/vehicles', vehicleroute);
app.use('/api/anotherss',kycroutee)
app.use('/api/admin', adminRoute);
 
app.use('/api/kyc', kycroute);
app.use('/api/recommendations', recommendationRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', tagRoute);
app.use('/api/messages', messageRoute); // Use messageRoute
app.use('/api/socketids', idSockRoutes)
app.use('/api/interaction',interaction)

app.use('/api/storedata',localStorageDataRoute);
// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle 'sendMessage' event
  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;

    // Save message to the database (assuming you have a Message model)
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    // Emit the message to the receiver
    io.to(receiverId).emit('message', { senderId, message });
  });

  // Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = 5000;
server.listen(port, () => {
  console.log('Node server started on port ' + port);
});
