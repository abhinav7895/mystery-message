import { Message } from "@/model/Message";
import { UserModel } from "@/model/User";

const POST = async (request: Request) => {
  const { userName, content } = await request.json();

  try {
    const user = await UserModel.findOne({
      userName,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json({
        success : true,
        message : "Message sent successfully"
    }, {
        status : 200
    })
  } catch (error) {
    console.error("An unexpected error occured :  " + error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
