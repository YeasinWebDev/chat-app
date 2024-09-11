import Chat from "@models/Chat";
import Message from "@models/Message";
import { User } from "@models/User";
import { connectDB } from "@mongodb"

export const GET = async (req, {params}) => {
    try {
        await connectDB()

        const { userId } = params;

        const allChats =  await Chat.find({message: userId})
        .sort({lastMessageAt: -1})
        .populate({
            path: 'members',
            model:User
        }).
        populate({
            path:'messages',
            model:Message,
            populate:{
                path:'sender seenBy',
                model:User
            }
        }).exec()

        return new Response(JSON.stringify(allChats), {status: 200})
    } catch (error) {
        console.log(error)
        return new Response("Failed to get all chats", { status: 500 })
    }
}