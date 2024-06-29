import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDb";
import { UserModel } from "@/model/User";

import { sendVerificationMail } from "@/helpers/sendVerificationMail";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { userName, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exist",
        },
        {
          status: 400,
        }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationMail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User created successfully, Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error while registering user" + error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      {
        status: 500,
      }
    );
  }
}


/**
 * algo 
 * 
 * if user is always exist [username exist && isVerified] -> X
 * 
 * if(userExistWithEmai)
 * -> check if it isVerified
 * if yes then X
 * else created the new password, verifyCode, codeExpiry, send the mail as welll
 * else create the user
 * 
 * now at this point the user is created and have to send the verification email onlyy
 * send it 
 * if failed -> X
 * else success trueeee
 */