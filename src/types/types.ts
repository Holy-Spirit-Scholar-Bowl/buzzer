export interface Alert {
  message: string;
  time: Date;
  id: number;
}

export type ChangelogItem = {
  date: ChangelogDate;
  version: string;
  header: string;
  body: string;
  items?: string[];
};

export type ChangelogDate = {
  day: number;
  month: number;
  year: number;
};

export enum ReceiveCommands {
  buzzer = "buzzer",
  chat = "chat",
  name = "name",
  clear = "clear",
  success = "success",
  host = "host",
  buzz = "buzz",
  online = "online",
  team = "team"
}

export enum SendCommands {
  reset = "reset",
  clear = "clear",
  kick = "kick",
  name = "name",
  host = "host",
  ans = "ans",
  buzz = "buzz",
  chat = "chat",
  teams = "teams",
  points = "points",
  restart = "restart"
}

export type Command<K, T extends string> = {
  command: T;
  parameters: K;
  sent: number;
  user: {
    name: string;
    realName: string;
    team: string;
    host: boolean;
  };
};

export type NullParameters = null;

export type ReceiveBuzzParameters = {
  buzzer: string;
}
export type ReceiveChatParameters = {
  message: string;
  name: string;
};
export type ReceiveHostParameters = {
  host: string;
};
export type ReceiveBuzzerParameters = {
  buzzer: string | null;
};
export type ReceiveOnlineParameters = {
  users: {
    user: string;
    points: number;
  }[];
  teams: {
    team: string;
    points: number;
    users: {
      user: string;
      points: number;
    }[];
  };
};
export type ReceiveTeamParameters = {
  team: string;
}

export type SendNameParameters = NullParameters
export type SendHostParameters = ReceiveHostParameters;
export type SendKickParameters = {
  name: string;
};
export type SendAnsParameters = {
  correct: boolean;
  powerOrNeg: boolean;
};
export type SendBuzzParameters = ReceiveBuzzParameters;
export type SendChatParameters = {
  message: string;
};
export type SendTeamsParameters = {
  users: {
    name: string;
    team: string;
  }[];
}
export type SendPointsParameters = {
  name: string;
  points: number;
}

export type SendCommandMap = {
  "ans":     SendAnsParameters;
  "buzz":    SendBuzzParameters;
  "chat":    SendChatParameters;
  "clear":   NullParameters;
  "host":    SendHostParameters;
  "kick":    SendKickParameters;
  "name":    SendNameParameters;
  "reset":   NullParameters;
  "teams":   SendTeamsParameters;
  "points":  SendPointsParameters;
  "restart": NullParameters;
}

export type SendCommandsKey = keyof typeof SendCommands;
export type SendCommandParameters<T extends SendCommandsKey> = SendCommandMap[T];
export type SendCommand<T extends SendCommandsKey> = Command<SendCommandParameters<T>, T>;

export type ReceiveCommandMap = {
  "buzzer":  ReceiveBuzzerParameters;
  "chat":    ReceiveChatParameters;
  "buzz":    ReceiveBuzzParameters;
  "clear":   NullParameters;
  "name":    NullParameters;
  "success": NullParameters;
  "host":    ReceiveHostParameters;
  "online":  ReceiveOnlineParameters;
  "team":    ReceiveTeamParameters;
};

export type ReceiveCommandsKey = keyof typeof ReceiveCommands;
export type ReceiveCommandParameters<T extends ReceiveCommandsKey> = ReceiveCommandMap[T];
export type ReceiveCommand<T extends ReceiveCommandsKey> = Command<ReceiveCommandParameters<T>, T>;
