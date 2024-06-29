import connectDB from "@/lib/connectDb";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";
import { UserModel } from "@/model/User";

const UsernameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {

  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      userName: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);

    console.log(result); // TODO REMOVE

    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors[0]
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    const {userName} = result.data;

    const  existingVerifiedUser =  await UserModel.findOne({
        userName,
        isVerified : true
    });

    if (existingVerifiedUser) {
        return Response.json({
            success : false,
            message : "Username already exist"
        }, {
            status : 400
        })
    }

    return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        {
          status: 200,
        }
      );
  } catch (error) {
    console.error("Error while checking the username " + error);

    return Response.json(
      {
        success: false,
        message: "Error while checking the username",
      },
      {
        status: 500,
      }
    );
  }
}
