import { useSession } from "next-auth/react";

type AuthorisedUser = {
  name: string;
  email: string;
  image: string;
  usingNextAuth: boolean;
};

export function emailToImage(email: string) {
  return email === "insert@revolt.chat"
    ? "https://autumn.revolt.chat/avatars/6rgg372gI2LrxCUx0CiA2R1Qs6eTtmC-2NpMq1Xa_3/e4332b6d70619b8a98086e532dbd4b9e.png"
    : email === "tom@revolt.chat"
      ? "https://autumn.revolt.chat/avatars/gXhOXC82uHPk2EtWe0cvcE1Du7h1rjKFOhFcvqxKHp?max_side=256"
      : "https://autumn.revolt.chat/avatars/pYjK-QyMv92hy8GUM-b4IK1DMzYILys9s114khzzKY";
}

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
      image: emailToImage(""),
      usingNextAuth: false,
    };
  } else {
    const { data: session } = useSession();
    if (!session?.user?.email) {
      if (allowNull) return null!;

      return {
        name: "Fetching user...",
        email: "first.last@example.com",
        image: emailToImage(""),
        usingNextAuth: true,
      };
    }

    return {
      name: session.user.name ?? session.user.email ?? "A User",
      email: session.user.email,
      image: session.user.image ?? emailToImage(session.user.email),
      usingNextAuth: true,
    };
  }
}
