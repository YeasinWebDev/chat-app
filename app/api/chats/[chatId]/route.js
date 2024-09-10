import Chat from "@models/Chat"
import { User } from "@models/User"
import { connectDB } from "@mongodb"

export const GET = async (req,{params}) => {
try {
    await connectDB()

    const chat = await Chat.findById(params.chatId).populate({
        path: 'members',
        model:User
    })

    return new Response(JSON.stringify(chat), { status:200})
    
} catch (error) {
    console.log(error)
    return new Response("Failed to get chat", { status: 500})
}
}