import { User } from "@models/User"
import { connectDB } from "@mongodb"

export async function GET(req, res, next) {
    try {
        await connectDB()

        const allusers = await User.find()

        return new Response(JSON.stringify(allusers),{status: 200})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server Error' })
    }
}
