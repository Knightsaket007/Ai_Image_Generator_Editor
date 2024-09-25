import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("Missing WEBHOOK_SECRET");
        return new Response("Error: Missing webhook secret", { status: 400 });
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("Missing svix headers");
        return new Response("Error: Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    
    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    // Log start of verification
    console.log("Verifying webhook...");
    
    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred during verification", {
            status: 400,
        });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    // Log event type
    console.log(`Received event: ${eventType}`);

    // Send a quick acknowledgment response to avoid timeout
    NextResponse.json({ message: "Webhook received, processing..." });

    // CREATE
    if (eventType === "user.created") {
        console.log("Processing user creation...");
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
        console.log("user created ..", id, email_addresses, image_url, first_name, last_name, username);

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username|| `username_${id}`,
            firstName: first_name || "",
            lastName: last_name || "",
            photo: image_url,
        };

        try {
            const newUser = await createUser(user);
            if (newUser) {
                await clerkClient.users.updateUserMetadata(id, {
                    publicMetadata: {
                        userId: newUser._id,
                    },
                });
            }
            console.log("User created successfully");
        } catch (error) {
            console.error("Error during user creation:", error);
        }
    }

    // UPDATE
    if (eventType === "user.updated") {
        console.log("Processing user update...");
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
            firstName: first_name || "",
            lastName: last_name || "",
            username: username!,
            photo: image_url,
        };

        try {
            const updatedUser = await updateUser(id, user);
            console.log("User updated successfully");
        } catch (error) {
            console.error("Error during user update:", error);
        }
    }

    // DELETE
    if (eventType === "user.deleted") {
        console.log("Processing user deletion...");
        try {
            const deletedUser = await deleteUser(id!);
            console.log("User deleted successfully");
        } catch (error) {
            console.error("Error during user deletion:", error);
        }
    }

    return new Response("", { status: 200 });
}
