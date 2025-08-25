import connectDB from "@/config/db";
import User from "@/db/schema/User";

export async function GET() {
    await connectDB();

    try {
        const user = await User.find();
        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}