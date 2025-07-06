// server.js
//original
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import cors
import morgan from 'morgan'; // For logging
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userroutes.js';
import messageRouter from './routes/messageroutes.js';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
// Create HTTP server
const httpServer = createServer(app);
// Initialize Socket.IO
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// Logging Middleware
app.use(morgan('dev'));

//  CORS Configuration
// const cors=require('cors');
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend's origin
//     credentials: 'true', // Allow credentials (cookies) to be sent
// }));

//const cors=require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow custom headers if necessary
  }));
  

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter); // Use the users router
app.use('/api/messages', messageRouter);

const userSocketMap = {};
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('identify', (userId) => {
        if (userId) {
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} identified with socket ${socket.id}`);
            // Notify the user that they've been identified
            socket.emit('identified', { success: true });
        } else {
            console.warn('Received identify event without userId');
            socket.emit('identified', { success: false, error: 'No userId provided' });
        }
    });

    socket.on('sendMessage', (data) => {
        try {
            const { receiverId, senderId, message } = data;
            
            if (!receiverId || !senderId || !message) {
                console.warn('Invalid message data:', data);
                return;
            }

            const receiverSocketId = userSocketMap[receiverId];
            
            if (receiverSocketId) {
                // Send to receiver
                io.to(receiverSocketId).emit('receiveMessage', data);
                // Send acknowledgment to sender
                socket.emit('messageSent', { success: true, messageId: data._id });
                console.log(`Message sent from ${senderId} to ${receiverId}`);
            } else {
                console.log(`Receiver ${receiverId} not found`);
                socket.emit('messageSent', { 
                    success: false, 
                    error: 'Receiver not found',
                    messageId: data._id 
                });
            }
        } catch (error) {
            console.error('Error in sendMessage socket event:', error);
            socket.emit('messageSent', { 
                success: false, 
                error: 'Internal server error',
                messageId: data._id 
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // Find and remove the user from the map
        const userId = Object.keys(userSocketMap).find(
            key => userSocketMap[key] === socket.id
        );
        if (userId) {
            delete userSocketMap[userId];
            console.log(`Removed user ${userId} from socket map`);
        }
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
