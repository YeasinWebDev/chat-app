import { User } from "@models/User";
import { connectDB } from "@mongodb";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    secret:process.env.NEXTAUTH_SECRET,
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials, req) {
                if(!credentials.email || !credentials.password){
                    throw new Error("Please enter your email and password");
                }

                await connectDB()

                const user = await User.findOne({email: credentials.email});

                if(!user || !user.password){
                    throw new Error("Invalid email or password")
                }

                const isMach = await compare(credentials.password, user.password)

                if(!isMach){
                    throw new Error("Invalid password")
                }
                return user;

            }
        })
    ],
    callbacks:{
        async session({session}) {
            const mongodbUser = await User.findOne({email: session.user.email})
            session.user.id = mongodbUser._id.toString()

            session.user = {...session.user, ...mongodbUser._doc}
            return session
        },
    }
})


export { handler as GET, handler as POST }