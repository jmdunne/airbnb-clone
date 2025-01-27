import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// This function handles the POST request
export async function POST(request: Request) {
  // Get the current user
  const currentUser = await getCurrentUser();

  // If there is no current user, return an error response
  if (!currentUser) {
    return NextResponse.error();
  }

  // Parse the request body as JSON
  const body = await request.json();

  // Extract the necessary properties from the request body
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  // Check if any of the properties in the request body are empty or falsy
  // If so, return an error response
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Create a new listing in the database using the extracted properties
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  });

  // Return the created listing as a JSON response
  return NextResponse.json(listing);
}
