import bcrypt from "bcryptjs";
import User from "../../../database/models/user.model";
import { connectToDatabase } from "../../../database/mongoose";

export async function POST(req: Request) {
  const body = await req.json();

  await connectToDatabase();

  const existingUser = await User.findOne({
    email: body.email,
  });

  if (existingUser) {
    return Response.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(
    body.password,
    10
  );

  const user = await User.create({
    name: body.name,
    email: body.email,
    password: hashedPassword,
  });

  return Response.json(user);
}