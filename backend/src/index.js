import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import path from 'path';

import { connectDb } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app ,server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Increased limits to allow large image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")));
    
    // Updated wildcard match for Express 5 compatibility
    app.get("*path", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDb();
});