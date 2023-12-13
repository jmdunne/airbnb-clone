// Import Prisma and PrismaClient from the Prisma client library
import { Prisma, PrismaClient } from "@prisma/client";

// Declare a global variable 'prisma' which can be either an instance of PrismaClient or undefined
declare global {
  var prisma: PrismaClient | undefined;
}

// If 'prisma' is already defined in the global scope, use it; otherwise, create a new instance of PrismaClient
const client = global.prisma || new PrismaClient();

// If the current environment is not production, assign the 'prisma' instance to the global scope
// This is to prevent creating new instances of PrismaClient in development and testing environments, which can lead to database connections not being closed properly
if (process.env.NODE_ENV != "production") globalThis.prisma = client;

// Export the 'prisma' instance for use in other modules
export default client;
