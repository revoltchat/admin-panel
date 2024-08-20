import { createCollectionFn } from "..";

export type RevoltAccount = {
  _id: string;
  email: string;
  email_normalised: string;

  verification: {
    status: "Verified" | "Pending" | "Moving";
  };

  deletion?:
    | {
        status: "WaitingForVerification" | "Deleted";
      }
    | {
        status: "Scheduled";
        after: string;
      };

  lockout?: {
    attempts: number;
    expiry: string;
  };

  mfa?: {
    totp_token?: {
      status: "Disabled" | "Pending" | "Enabled";
    };
    recovery_codes?: string[];
  };

  disabled: boolean;
  spam: boolean;
};

const accountCol = createCollectionFn<RevoltAccount>("revolt", "accounts");

/**
 * Fetch an account by given ID
 * @param id ID
 * @returns Account if exists
 */
export function fetchAccountById(id: string) {
  return accountCol()
    .findOne(
      { _id: id },
      {
        projection: {
          password: 0,
          "mfa.totp.secret": 0,
        },
      },
    )
    .then((account) => {
      if (account?.mfa?.recovery_codes) {
        account.mfa.recovery_codes = account.mfa.recovery_codes.map(
          (_) => "CODE",
        );
      }
      return account;
    });
}
