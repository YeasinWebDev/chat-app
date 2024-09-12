import Chat from "@models/Chat"
import { connectDB } from "@mongodb"

export const POST = async (req, {params}) =>{

    try {
        await connectDB()
        const body = await req.json()
        const { chatId } = params
        const {name, groupPhoto} = body

        const updatedGroupPhoto = await Chat.findByIdAndUpdate(
            chatId,
            {name, groupPhoto},
            {new: true}
        )
        return new Response(JSON.stringify(updatedGroupPhoto),{status: 200})
    } catch (error) {
        console.error(error)
        return new Response("Failed to update group photo", { status: 500 })
    }
}