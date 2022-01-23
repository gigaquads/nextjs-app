import "next-auth";

// this is necessary in order to extend next-auth's base User object on session:
declare module "next-auth" {
  interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    expires: ISODateString;
    user?: User | null;
  }
}
