import { transformationTypes } from "@/constants";
import { url } from "inspector";
import { Document, model, models, Schema } from "mongoose";

export interface IImage extends Document{
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: object;
    transformationUrl?: URL;
    aspactRatio?: string;
    color?: string;
    prompt?: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ImageSchema=new Schema({
    title:{type: String, require:true},
    transformationType:{type:String, require:true},
    publicId:{type:String, require:true},
    secureURL:{type:String, require:true},
    width:{type:Number},
    height:{type:Number},
    config:{type:Object},
    transformationUrl:{type:String},
    aspactRatio:{type:String},
    color:{type:String},
    prompt:{type:String},
    author:{type:Schema.Types.ObjectId, ref:'User'},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
})


const Image=models?.Image || model('Image', ImageSchema);
export default Image;