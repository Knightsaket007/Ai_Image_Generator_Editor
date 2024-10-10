"use server";

import { revalidatePath } from "next/cache";

import User from "../db/models/user.model";
import { connectToDatabase } from "../db/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    const newUser = await User.create(user);
    return newUser.toObject(); // Convert to plain JS object
  } catch (error) {
    return handleError(error); // Provide useful response
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true }).lean(); // Use lean() and return plain object
    if (!updatedUser) throw new Error("User update failed");

    return updatedUser;
  } catch (error) {
    return handleError(error); // Add return for webhook response
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId }).lean();  // .lean() ensures a plain object is returned

if (!userToDelete) {
  throw new Error("User not found");
}

// TypeScript now knows that userToDelete is an object, not an array
const deletedUser = await User.findByIdAndDelete((userToDelete as { _id: any })._id);
revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    ).lean();

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return updatedUserCredits;
  } catch (error) {
    return handleError(error); // Add return for webhook response
  }
}