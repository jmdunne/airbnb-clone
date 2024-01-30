import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { type } from "os";

// Define the interface for the request parameters
interface IParams {
  listingId?: string;
}

// Define the POST function that handles the HTTP POST request
export async function POST(request: Request, { params }: { params: IParams }) {
  // Get the current user
  const currentUser = await getCurrentUser();

  // If there is no current user, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Extract the listingId from the request parameters
  const { listingId } = params;

  // Check if the listingId is valid
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  // Create a copy of the favoriteIds array from the current user
  let favoriteIDs = [...(currentUser.favoriteIds || [])];

  // Add the listingId to the favoriteIds array
  favoriteIDs.push(listingId);

  // Update the user's favoriteIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIDs,
    },
  });

  // Return the updated user as a JSON response
  return NextResponse.json(user);
}

// Define the DELETE function that handles the HTTP DELETE request
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  // Get the current user
  const currentUser = await getCurrentUser();

  // If there is no current user, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Extract the listingId from the request parameters
  const { listingId } = params;

  // Check if the listingId is valid
  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  // Create a copy of the favoriteIds array from the current user
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // Remove the listingId from the favoriteIds array
  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  // Update the user's favoriteIds in the database
  const user = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIds,
    },
  });

  // Return the updated user as a JSON response
  return NextResponse.json(user);
}
