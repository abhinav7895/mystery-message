import { UserModel } from "@/model/User";
import { z } from "zod";
import connectDB from "@/lib/connectDb";
import { userNameValidation } from "@/schemas/signUpSchema";
import { VerifySchema } from "@/schemas/verifySchema";


const requestSchema = z.object({
  verifyCode: VerifySchema,
});

export const POST = async (request: Request) => {
  connectDB();

  try {
    const {username, verifyCode} = await request.json();

    const result = requestSchema.safeParse({
        verifyCode : {
            code : verifyCode
        }
    });


    if (!result.success) {
      const errors = result.error.format().verifyCode?.code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            errors.length > 0
              ? errors[0]
              : "Verification code must be 6 digits",
        },
        {
          status: 400,
        }
      );
    }

    const user = await UserModel.findOne({ userName : username});
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User does not exist",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }



    const isCodeValid = verifyCode === user.verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    console.log(isCodeNotExpired, isCodeValid);
    

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return new Response(
        JSON.stringify({
          success: true,
          message: "Account verified successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (!isCodeNotExpired) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "Verification code has expired. Please sign up again to receive a new code.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Incorrect verification code",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error while verifying the code: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while verifying the code",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
