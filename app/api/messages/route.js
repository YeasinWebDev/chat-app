import { pusherSarver } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import { User } from "@models/User";
import { connectDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    const { chatId, currentUserId, photo, text } = body;
    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      photo,
      text,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: newMessage._id },
          $set: { lastMessageAt: newMessage.createdAt },
        },
        { new: true }
      )
        .populate({
          path: "messages",
          model: Message,
          populate: { path: "sender seenBy", model: "User" },
        })
        .populate({
          path: "members",
          model: "User",
        })
        .exec();  

        // trigger for new messages
        await pusherSarver.trigger(chatId, 'new-message', newMessage)


        const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

          updatedChat.members.forEach(async (member) => {
            try {
              await pusherSarver.trigger(member._id.toString(), "update-chat", {
                id: chatId,
                messages: [lastMessage]
              });
            } catch (err) {
              console.error(`Failed to trigger update-chat event`);
            }
          });


    return new Response(JSON.stringify(newMessage),{status:200})

  } catch (error) {
    console.log(error);
    return new Response("Failed to send message", { status: 500 });
  }
};
