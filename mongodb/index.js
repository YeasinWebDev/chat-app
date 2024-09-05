import mongoose, { Mongoose } from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    mongoose.set('strictQuery', true)

    if(isConnected) {
        console.log('Already connected to MongoDB')
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL,{
            dbName:'Chat',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (error) {
        console.log(error)
    }
}