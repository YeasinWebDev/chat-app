import Chat from "@models/Chat"
import Message from "@models/Message"
import { User } from "@models/User"
import { connectDB } from "@mongodb"

export const GET = async (req,{params}) => {
try {
    await connectDB()

    const chat = await Chat.findById(params.chatId).populate({
        path: 'members',
        model:User
    }).populate({
        path:'messages',
        model:Message,
        populate:{
            path:'sender seenBy',
            model:User
        }
    }).exec()

    return new Response(JSON.stringify(chat), { status:200})
    
} catch (error) {
    console.log(error)
    return new Response("Failed to get chat", { status: 500})
}
}


export const POST = async (req,{params}) => {
    try {
        await connectDB()
         const body = await req.json()
         const {currentUserId} = body

         await Message.updateMany(
            {chat:params.chatId},
            {$addToSet: {seenBy: currentUserId}},
            {new: true}
         ).populate({
             path:'seenBy sender',
             model:User
         }).exec()

         return new Response(JSON.stringify({success:true}), { status:200})
    } catch (error) {
        console.log(error)
        return new Response("Failed to mark messages as seen", { status: 500})
    }
}