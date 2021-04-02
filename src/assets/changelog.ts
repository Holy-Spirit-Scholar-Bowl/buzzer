import { ChangelogItem } from "@/types";

export const changelog: ChangelogItem[] = [
  {
    date: {
      year: 2020,
      day: 22,
      month: 10,
    },
    version: "2.0.0",
    header: "Refactor",
    body:
      "Did a lot of internal cleanup. Should make future improvements easier.",
    items: [
      "Alerts now display properly on smaller devices",
      "Alerts no longer display as having been created a negative number of seconds ago",
      "Scoreboard works correctly for users with a space in their name",
      "Added changelog",
    ],
  },
  {
    date: {
      year: 2020,
      day: 4,
      month: 11,
    },
    version: "2.1.0",
    header: "Another refactor",
    body:
      "Changed the internal state-management system up a bit. It's now more concise and easier to work with. This won't produce many visible changes (or at least it's not supposed to), but should make it quicker to add features in the future.",
    items: [
      "Naming is slightly improved, particularly for anonymous users",
      "Alerts should be a little less buggy",
      "Scoreboard is more reliable",
    ],
  },
  {
    date: {
      year: 2020,
      day: 4,
      month: 11,
    },
    version: "2.1.1",
    header: "Version upgrades",
    body:
      "Fetching the updated version of the site when it changes should be easier now, and it's also possible to tell what version you are currently running.",
    items: [
      "Normal reload updates the site, not only a hard reload",
      "Website version is visible",
    ],
  },
  {
    date: {
      year: 2020,
      day: 11,
      month: 11,
    },
    version: "2.2.0",
    header: "Scoreboard",
    body: "The scoreboard has been improved, along with some other fixes",
    items: [
      "Scoreboard points save when you disconnect",
      "Version indicator in the footer displays newest version",
      "Changelog is visible",
      "Settings now display in their own panel",
      "Actions that can only be performed by the host are now separate",
    ],
  },
  {
    date: {
      year: 2020,
      day: 18,
      month: 11,
    },
    version: "2.2.1",
    header: "Fixes",
    body: "Various bug fixes to improve experience",
    items: [
      "Scoreboard actually shows when user has buzzed",
      "Alerts are fixed",
    ],
  },
  {
    date: {
      year: 2020,
      day: 18,
      month: 11,
    },
    version: "2.2.2",
    header: "Update fixes",
    body: "It should be much easier to access new versions now",
    items: [
      "A normal reload will fetch the newest version",
      "Some internal reworking",
    ],
  },
  {
    date: {
      year: 2020,
      day: 25,
      month: 11,
    },
    version: "2.3.0",
    header: "Internal reworking",
    body: "Communication between the device and server has been reworked",
    items: [
      "Things are less likely to break in the future",
      "You can have more special characters in your name (because there aren't any delimiters anymore)",
    ],
  },
  {
    date: {
      year: 2020,
      day: 8,
      month: 12,
    },
    version: "2.4.0",
    header: "More internal reworking",
    body: "Fixes a bug and cleans up things on the inside",
    items: [
      "The buzzer should not change anymore. The first user who buzzed is displayed as having done such.",
      "TypeScript has been appeased...for now",
      "The server logic has been split up to make life simpler",
    ]
  },
  {
    date: {
      year: 2020,
      day: 8,
      month: 12,
    },
    version: "2.4.1",
    header: "Minor improvements",
    body: "Just some minor upgrades under the hood",
    items: [
      "Improved accessibility",
      "Changelog is in its own file",
      "Clean up typings"
    ]
  },
  {
    date: {
      year: 2020,
      day: 8,
      month: 12,
    },
    version: "2.5.0",
    header: "Teams",
    body: "You can now join a team and score points with others on the team. Also includes some bug fixes.",
    items: [
      "Buzzer should not change anymore (for real this time)",
      "Communication takes place between the server and client a little differently",
      "You can join a team and the host can assign teams"
    ]
  },
  {
    date: {
      year: 2020,
      day: 17,
      month: 12
    },
    version: "2.6.0",
    header: "Developer tools",
    body: "Added a few backdoors for emergencies. They aren't intended for normal use, so they shouldn't affect much."
  },
  {
    date: {
      year: 2020,
      day: 18,
      month: 12
    },
    version: "2.6.1",
    header: "More developer tools, minor improvements",
    body: "Just some internal cleanup. None of it should affect user experience"
  }
].reverse(); // Since new items are added on the bottom and are displayed at the top, the array should be reversed