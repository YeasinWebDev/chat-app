import Chat from "@models/Chat"
import Message from "@models/Message"
import { User } from "@models/User"
import { connectDB } from "@mongodb"

export const GET = async (req, {params}) => {
    try {
        await connectDB()

        const {userId, query} = params
        // let resultData = []

        const searchedchat = await Chat.find({
            members:userId,
            name: {$regex: query, $options: 'i'}
        }).populate({
            path:'members',
            model:User
        }). populate({
            path:'messages',
            model:Message,
            populate:{
                path:'sender seenBy',
                model:User
            }
        }).exec()

        // if (searchedchat.length) {
        //     resultData = searchedchat;
        //   } else  {
        //     const searchresult = await User.findOne({
        //         username: { $regex: query, $options: 'i' }
        //       });
        
        //       if (searchresult) {
        //         const userIdToSearch = searchresult._id;
        //         console.log(userIdToSearch)
                
        //         const ChatData = await Chat.find({ 
        //             members:userIdToSearch
        //          })
        //           .populate({
        //             path: 'members',
        //             model: User
        //           }).exec();
        
        //         resultData = ChatData;
        //       }
        // }

        return new Response(JSON.stringify(searchedchat), {status: 200})
    } catch (error) {
        console.log(error)
        return new Response("Failed to get searched chat", {status: 500})
    }
}