import { Badge, Flex, Text } from "@radix-ui/themes";

export function Cat() {
  return (
    <>
      <Text color="iris" size="1">
        Problems with the case
      </Text>
      <Flex gap="2" wrap="wrap">
        <Badge color="gray">
          <b>Invalid</b> Report(s) don't make sense
        </Badge>
        <Badge color="gray">
          <b>False</b> Report(s) are clearly false
        </Badge>
        <Badge color="gray">
          <b>Spam</b> Report(s) are clearly spam
        </Badge>
        <Badge color="gray">
          <b>Not Enough Evidence</b> Not enough evidence to act on report
        </Badge>
        <Badge color="gray">
          <b>Clarification Needed</b> More information is needed
        </Badge>
        <Badge color="gray">
          <b>Acknowledge</b> Report(s) will be acknowledged but no action taken
        </Badge>
        <Badge color="gray">
          <b>Ignore</b>
        </Badge>
      </Flex>

      <Text color="iris" size="1">
        Reasons for acting on case
      </Text>
      <Flex gap="2" wrap="wrap">
        <Badge color="gray">
          <b>Extremism</b> Violent extremism
        </Badge>{" "}
        <Badge color="gray">
          <b>Misinformation</b> Misinformation & conspiracy theories
        </Badge>{" "}
        <Badge color="gray">
          <b>Hate Conduct</b> Hate speech or hateful conduct
        </Badge>{" "}
        <Badge color="gray">
          <b>Self Harm</b> Promoting, encouraging or glorifying self-harm or
          suicide
        </Badge>{" "}
        <Badge color="gray">
          <b>Illegal Behaviour</b> Promoting, organising or engaging in illegal
          behaviour
        </Badge>
        <Badge color="gray">
          <b>Off Platform</b> Promoting off-platform content in violation of
          usage policy
        </Badge>
        <Badge color="gray">
          <b>Illegal Content</b> Content deemed illegal
        </Badge>
        <Badge color="gray">
          <b>Harassment</b> Content designed to harass or degrade someone (incl.
          death threats, doxing, ignoring someoneone's privacy)
        </Badge>
        <Badge color="gray">
          <b>Raiding</b> Participating in a raid
        </Badge>
        <Badge color="gray">
          <b>Rights Infringement</b> Content violating intellectual property or
          other rights
        </Badge>
        <Badge color="gray">
          <b>Gore</b> Real-life violence, gore, or animal cruelty
        </Badge>
        <Badge color="gray">
          <b>Malware</b>
        </Badge>
        <Badge color="gray">
          <b>Impersonation</b>
        </Badge>
        <Badge color="gray">
          <b>Underage Sexual Content</b> Soliciting or providing sexual content
          to minors
        </Badge>
        <Badge color="gray">
          <b>Underage Sexual Conduct</b> Engaging in sexual conduct with minors
        </Badge>
        <Badge color="gray">
          <b>Underage Unsafe Conduct</b> Minors engaging in any conduct that may
          put their safety at risk
        </Badge>
        <Badge color="gray">
          <b>Explicit Content</b> Sharing explicit content in places where it
          can't be age restricted
        </Badge>
        <Badge color="gray">
          <b>Unsolicited Advertising</b>
        </Badge>
        <Badge color="gray">
          <b>Fraud</b> Financial scams or other types of fraud
        </Badge>
        <Badge color="gray">
          <b>Account Trade</b> Buying or selling of Revolt accounts
        </Badge>
        <Badge color="gray">
          <b>Artificial Growth</b> Providing or using means to artificially grow
          servers
        </Badge>
        <Badge color="gray">
          <b>Evasion</b> Evasion of permanent platform-level moderation actions
        </Badge>
        <Badge color="gray">
          <b>Hacking</b> Engaging in hacking such as phishing, malware, DoS, etc
        </Badge>
        <Badge color="gray">
          <b>Unauthorised Access</b> Attempts to hack or otherwise gain
          unauthorised access to our service
        </Badge>
        <Badge color="gray">
          <b>Abuse</b> Abusing our server resources
        </Badge>
        <Badge color="gray">
          <b>User Bot</b> Automated activity from user not initiated by the user
        </Badge>
        <Badge color="gray">
          <b>Misleading Team</b> Providing false or deceptive reports to our
          team
        </Badge>
      </Flex>
    </>
  );
}
