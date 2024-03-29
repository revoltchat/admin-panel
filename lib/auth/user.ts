import { useSession } from "next-auth/react";

type AuthorisedUser = {
  name: string;
  email: string;
  image: string;
  usingNextAuth: boolean;
};

/**
 * Use the currently authorised user
 * @param allowNull Whether to allow a null user to be returned
 * @returns User details
 */
export function useAuthorisedUser(allowNull = false): AuthorisedUser {
  if (process.env.NEXT_PUBLIC_AUTH_TYPE === "none") {
    return {
      name: "Instance Owner",
      email: "owner@example.com",
      image: "/tmp/pfp.png",
      usingNextAuth: false,
    };
  } else {
    const { data: session } = useSession();
    if (!session?.user?.email) {
      if (allowNull) return null!;

      return {
        name: "Fetching user...",
        email: "first.last@example.com",
        image: "/tmp/pfp.png",
        usingNextAuth: true,
      };
    }

    return {
      name: session.user.name ?? session.user.email ?? "A User",
      email: session.user.email,
      image: session.user.image ?? "/tmp/pfp.png",
      usingNextAuth: true,
    };
  }
}
