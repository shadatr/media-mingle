import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: JWT;
      birth_date: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: number
          joined_date: string | null
          name: string | null
          password: string | null
          private: boolean | null
          profile_picture: string | null
          username: string | null
    };
  }
}