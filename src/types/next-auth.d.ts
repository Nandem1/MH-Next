import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    id_local: number | null;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      id_local: number | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    id_local: number | null;
  }
} 