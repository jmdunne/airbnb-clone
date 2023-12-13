// Import necessary modules and dependencies
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import {
  GithubProvider,
  GoogleProvider,
  CredentialsProvider,
} from "next-auth/providers";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb.ts"; // Import the Prisma client

// Define the authentication options
export const authOptions: AuthOptions = {
  // Set the adapter for NextAuth.js to use Prisma as the data source
  adapter: PrismaAdapter(prisma),

  // Define the providers for authentication
  providers: [
    // Configure the GitHub provider for authentication
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Configure the Google provider for authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Configure the Credentials provider for authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      // Define the authorization logic for the Credentials provider
      async authorize(credentials) {
        // Check if email and password are provided
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Find the user in the database based on the provided email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if the user exists and has a hashed password
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // Compare the provided password with the hashed password stored in the database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // If the password is incorrect, throw an error
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Return the user object if authentication is successful
        return user;
      },
    }),
  ],
  // Define the pages for sign in
  pages: {
    signIn: "/",
  },
  // Enable debug mode in development environment
  debug: process.env.NODE_ENV === "development",
  // Define the session strategy
  session: {
    strategy: "jwt",
  },
  // Define the secret for NextAuth
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the NextAuth function with the defined authentication options
export default NextAuth(authOptions);
