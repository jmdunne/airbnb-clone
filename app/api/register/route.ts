// Import the bcrypt library for password hashing
import bcrpyt from "bcrypt";
// Import the Prisma client instance from the local file
import prisma from "@/app/libs/prismadb";
// Import the NextResponse object from the Next.js server library
import { NextResponse } from "next/server";

// Define an asynchronous function to handle POST requests
export async function POST(request: Request) {
  // Parse the JSON body of the request
  const body = await request.json();
  // Destructure the email, name, and password from the request body
  const { email, name, password } = body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrpyt.hash(password, 12);

  // Create a new user in the database using Prisma, with the provided email, name, and hashed password
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  // Return the created user as a JSON response
  return NextResponse.json(user);
}
