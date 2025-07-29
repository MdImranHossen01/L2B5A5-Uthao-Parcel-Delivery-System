import {Sever} from 'http';
import mongoose from 'mongoose';
import app from './app';
import {envVars} from "./app/config/env";

let server: Sever;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(envVars.DB_URL)
        console.log('Connected to MongoDB');

        // Start the server
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is running on port ${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    } else {
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    }
}); 

process.on('SIGTERM', () => {
    if (server) {
        server.close(() => {
            console.log('Server closed');
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    } else {
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    }
}); 

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    if (server) {
        server.close(() => {
            console.log('Server closed due to uncaught exception');
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(1);
            });
        });
    } else {
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(1);
        });
    }
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    if (server) {
        server.close(() => {
            console.log('Server closed due to unhandled rejection');
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(1);
            });
        });
    } else {
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(1);
        });
    }
}); 
