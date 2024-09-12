import { pusherSarver } from "@lib/pusher";
import Chat from "@models/Chat";
import { User } from "@models/User";
import { connectDB } from "@mongodb";

export const POST = async (req, res) => {
  try {
    await connectDB();
    const body = await req.json();

    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {

      chat = new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          { 
            $addToSet: { chats: chat._id } 
          },
          { new: true }
        );
      });
      await Promise.all(updateAllMembers);
      // Trigger a pusher event to notify a new chat
      chat.members.map((member) =>{
        pusherSarver.trigger(member._id.toString(), 'new-chat', chat)
      })
    }


    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to find chat", { status: 500 });
  }
};
