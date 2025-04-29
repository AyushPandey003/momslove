
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"

// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}
if (!process.env.AUTH_GOOGLE_ID) {
  throw new Error("Missing AUTH_GOOGLE_ID environment variable");
}
if (!process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("Missing AUTH_GOOGLE_SECRET environment variable");
}
if (!process.env.AUTH_SECRET) {
  throw new Error("Missing AUTH_SECRET environment variable");
}
 
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    adapter: NeonAdapter(pool),
    providers: [Google],
  }
})