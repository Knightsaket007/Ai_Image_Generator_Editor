import mongoose, {Mongoose, connection} from "mongoose";
const MongoDB_Url=process.env.MongoDb_Url;

interface MongooseConn{
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}

let cached: MongooseConn=(global as any).mongoose; 
if(!cached){
cached=(global as any).mongoose={
    conn:null, promise:null
}
}   

export const connectToDatabase=async()=>{
    if(cached.conn) return  cached.conn;

    if(!MongoDB_Url) throw new Error('Mongo_Url not found');

    cached.promise=cached.promise || mongoose.connect(MongoDB_Url, {
        dbName:"picfer",
        bufferCommands:false
    })

    cached.conn=await cached.promise;
    return cached.conn;

}