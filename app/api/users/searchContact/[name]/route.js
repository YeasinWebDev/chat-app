import { User } from "@models/User";
import { connectDB } from "@mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const { name } = params;
    const user = await User.find({
      $or: [
        { username: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to find user", { status: 500 });
  }
};
