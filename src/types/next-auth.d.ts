import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "TUTOR";
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "STUDENT" | "TUTOR";
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "STUDENT" | "TUTOR";
    isAdmin?: boolean;
  }
}
