'use server';

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || 'MONGODB_URI=mongodb://localhost:27017/window-estimation-db';
console.log("MongoDB URI:", uri);

const catched = (global as any).mongoose || {connection: null}


export default async function connectDb() {
    if (catched.connection) {
        return catched.connection;
    }
    
    if (!uri) {
        throw new Error("MONGODB_URI is not defined");
    }
    
    try {
        const connection = await mongoose.connect(uri);
        catched.connection = connection;
        console.log("MongoDB connected successfully");
        return connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

