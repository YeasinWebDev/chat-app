import { User } from "@models/User";
import { connectDB } from "@mongodb";

export const POST = async (req, { params }) => {
  try {
    await connectDB();
    const { userId } = params;

    const { username, profileImage } = await req.json();
    console.log(username, profileImage)


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, profileImage },
      { new: true }
    );

    return new Response(JSON.stringify(updatedUser), { status: 200 });

  } catch (error) {
    console.log(error);
    return new Response("Failed to update user profile",{status:500});
  }
};
