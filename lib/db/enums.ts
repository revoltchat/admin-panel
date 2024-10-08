import { CaseDocument } from "./types";

export const TYPES_PROBLEM_WITH_CASE = {
  Invalid: "Report(s) don't make sense or there isn't a rule violation",
  False: "Clearly false",
  "Report Spam": "Clearly spam",
  "Not Enough Evidence": "Not enough evidence to act on report",
  "Clarification Needed": "More information is needed",
  "Bridged Content": "Content came from a remote service",
  Acknowledge: "Report(s) will be acknowledged but no action taken",
  Duplicate: "Reported content has already been dealt with",
  Ignore: "",
};

export const TYPES_PROBLEM_WITH_CASE_KEYS = Object.keys(
  TYPES_PROBLEM_WITH_CASE,
).toSorted() as (keyof typeof TYPES_PROBLEM_WITH_CASE)[];

export const TYPES_VALID_CATEGORY = {
  Extremism: "Violent extremism",
  Misinformation: "Misinformation & conspiracy theories",
  "Hate Conduct": "Hate speech or hateful conduct",
  "Self Harm": "Promoting, encouraging or glorifying self-harm or suicide",
  "Illegal Behaviour": "Promoting, organising or engaging in illegal behaviour",
  "Off Platform": "Promoting off-platform content in violation of usage policy",
  "Illegal Content": "Content deemed illegal",
  Harassment:
    "Content designed to harass or degrade someone (incl. death threats, doxing, ignoring someone's privacy)",
  Raiding: "Participating in a raid",
  "Rights Infringement":
    "Content violating intellectual property or other rights",
  Gore: "Real-life violence, gore, or animal cruelty",
  Malware: "",
  Impersonation: "",
  Underage: "User is not within platform age requirements",
  "Underage Sexual Content": "Soliciting or providing sexual content to minors",
  "Underage Sexual Conduct": "Engaging in sexual conduct with minors",
  "Underage Unsafe Conduct":
    "Minors engaging in any conduct that may put their safety at risk",
  "Explicit Content":
    "Sharing explicit content in places where it can't be age restricted",
  "Unsolicited Advertising": "",
  Fraud: "Financial scams or other types of fraud",
  "Account Trade": "Buying or selling of Revolt accounts",
  "Artificial Growth": "Providing or using means to artificially grow servers",
  Evasion: "Evasion of permanent platform-level moderation actions",
  Hacking: "Engaging in hacking such as phishing, malware, DoS, etc",
  "Unauthorised Access":
    "Attempts to hack or otherwise gain unauthorised access to our service",
  Abuse: "Abusing our server resources",
  Spam: "Content or users with only intent to spam",
  "User Bot": "Automated activity from user not initiated by the user",
  "Misleading Team": "Providing false or deceptive reports to our team",
};

export const TYPES_VALID_CATEGORY_KEYS = Object.keys(
  TYPES_VALID_CATEGORY,
).toSorted() as (keyof typeof TYPES_VALID_CATEGORY)[];

export function reportCategoryTemplateResolutionResponse(
  key?: CaseDocument["category"],
) {
  switch (key?.[0]) {
    case "Invalid":
      return "These report(s) are invalid and no further action can be taken at this time.\nThis may be because:\n- No platform rules are being broken\n- The report doesn't make any sense\n- The reason provided doesn't apply to the content reported";
    case "False":
      return "These report(s) are clearly false and no action will be taken.\nRepeated false reports may lead to additional action against your account.";
    case "Report Spam":
      return "Report spam may lead to additional action against your account.";
    case "Not Enough Evidence":
      return "These report(s) have not been actioned at this time due to a lack of supporting evidence, if you have additional information to support your report, please either report individual relevant messages or send an email to contact@revolt.chat.";
    case "Clarification Needed":
      return "These report(s) need clarification and no further action can be taken at this time.\nIf you have additional information to support your report, please either report individual relevant messages or send an email to contact@revolt.chat.";
    case "Bridged Content":
      return "These report(s) concern bridged content and we cannot take any further action.\nIf appropriate, the content has been deleted.\nPlease notify the server's moderation team to deal with the matter on their end.\nIf you find the moderation team to be unresponsive, please follow up by reporting the server.";
    case "Acknowledge":
      return "These report(s) have been acknowledged, however no action will be taken at this time.";
    case "Duplicate":
      return "Appropriate action has already been taken in regards to the reported content, no further action will be taken.";
    case "Ignore":
      return "-no valid response-";
    default:
      if (!key || key.length === 0) return "-no category selected-";
      return "Report(s) have been actioned and appropriate action has been taken.";
  }
}
