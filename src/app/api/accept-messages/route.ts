import connectDB from "@/lib/connectDb";
import { UserModel } from "@/model/User";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export const POST = async (request: Request) => {
  await connectDB();

  const session = await getServerSession(authOptions);

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
  try {
    const user = session.user as User;
    const userId = user._id;

    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update user's message acceptance status",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update user status to accept messages: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const GET = async (request: Request) => {
  await connectDB();

  const session = await getServerSession(authOptions);

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

  try {
    const user = session.user as User;
    const userId = user._id;
    const foundUser = await UserModel.findOne({
      _id: userId,
    });

    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to get the user's message acceptance status",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status fetched successfully",
        isAcceptingMessage: user.isAcceptingMessages,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to update user status to accept messages: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
