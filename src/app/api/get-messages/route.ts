import { UserModel, User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/connectDb";
import mongoose from "mongoose";

export const GET = async (request: Request) => {
  connectDB();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not authenticated",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id as string);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
        return Response.json({
            success : false,
            message : "User not found"
        }, {
            status : 400
        })
    }

    return Response.json({
        success : false,
        message : "Messages fetched successfully",
        messages : user[0].message
    }, {
        status : 200
    })
  } catch (error) {}
};
