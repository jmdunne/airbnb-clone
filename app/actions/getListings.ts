// Import the Prisma client
import prisma from "@/app/libs/prismadb";

// Define an asynchronous function to get listings
export default async function getListings() {
  try {
    // Try to fetch all listings from the database
    // The findMany function returns a Promise that resolves to an array of listings
    // The results are ordered by their creation date in descending order
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // If the operation is successful, return the listings
    return listings;
  } catch (error: any) {
    // If there's an error during the operation, catch it and throw it again
    // This allows the error to be caught and handled by the calling code
    throw new Error(error);
  }
}
