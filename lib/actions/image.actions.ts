"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../db/mongoose"
import { handleError } from "../utils"
import User from "../db/models/user.model";
import { error } from "console";
import Image from "../db/models/image.model";
import { redirect } from "next/navigation";


const populateUser=(query:any)=>query.populate({
    path:'author',
    model:User,
    select:'_id firstName lastName'

})



//============== Add Image ============//
export async function addImage({image, userId, path}:AddImageParams) {

    try{
        await connectToDatabase();

        const author=await User.findById(userId);

        if(!author){
            throw new Error('User not found');
        }

        const newImage=await Image.create({
            ...image,
            author:author._id
        })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newImage))
    }
    catch(error){
        handleError(error)
    }
    
}


//============== Update Image ============//
export async function updateImage({image, userId, path}:UpdateImageParams) {

    try{
        await connectToDatabase();

        const imageToUpdate=await Image.findById(image._id);

        if(!imageToUpdate || imageToUpdate.author.toHexString() !==userId){
            throw new Error('Unautherized or Image not found');
        }

        const updatedImage=await Image.findByIdAndUpdate(
            imageToUpdate._id,
            image,
            {new:true}
        )

        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedImage))
    }
    catch(error){
        handleError(error)
    }
    
}


//============== Delete Image ============//
export async function deleteImage(imageId:string) {

    try{
        await connectToDatabase();

        await Image.findByIdAndDelete(imageId)

    }
    catch(error){
        handleError(error)
    }
    finally{
        redirect('/')
    }
    
}


//============== Get Image ============//
export async function getImageById(imageId:string) {

    try{
        await connectToDatabase();

        const image=await populateUser(Image.findById(imageId))

        if(!image) throw new Error('Image not found')

        return JSON.parse(JSON.stringify(image))
    }
    catch(error){
        handleError(error)
    }
    
}