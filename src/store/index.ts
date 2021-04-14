import Vue from "vue";
import {
  createModule,
  action,
  mutation,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import Vuex, { Store } from "vuex";
import {
  Alert,
  SendCommand,
  ReceiveChatParameters,
  ReceiveCommands,
  ReceiveCommand,
  SendCommandParameters,
  SendCommandsKey,
  ReceiveOnlineParameters,
} from "@/types";
import { changelog } from "@/assets/changelog";

Vue.use(Vuex);

const VuexModule = createModule({});

export class BuzzerStore extends VuexModule {
  // PRIVACY POLICY
  showPrivacyPolicy = !localStorage.seenPrivacyPolicy

  @mutation
  readPrivacyPolicy(): void {
    localStorage.seenPrivacyPolicy = "true"
    this.showPrivacyPolicy = false
  }

  // NAME
  _name = "";

  set name(value: string) {
    this._name = value;
    localStorage.hasName = value;
  }

  get name(): string {
    return this._name;
  }

  _realName = "";

  set realName(value: string) {
    this._realName = value;
    localStorage.realName = value;
  }

  get realName(): string {
    return this._realName;
  }

  _team = "";

  set team(value: string) {
    this._team = value;
    localStorage.team = value;
  }

  get team(): string {
    return this._team;
  }

  @mutation
  setTeam(value: string): void {
    this._team = value;
    localStorage.team = value;
  }

  // ALERTS
  alerts: Alert[] = [];
  totalAlerts = 0;

  @mutation
  addAlert(name: string): void {
    this.totalAlerts++;
    this.alerts.push({
      message: name,
      time: new Date(),
      id: this.totalAlerts,
    });
  }

  @mutation
  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter((e) => e.id !== alert.id);
  }

  // ONLINE LIST
  onlineList: ReceiveOnlineParameters = { users: [], teams: [] }

  @mutation
  parseOnlineList(cmd: ReceiveCommand<ReceiveCommands.online>): void {
    this.onlineList = cmd.parameters;
  }

  @action
  async resetPoints(): Promise<void> {
    this.sendCommand({
      type: "reset",
      parameters: null,
    });
  }

  // SOUND
  _muted = localStorage.muted === "true";

  set muted(value: boolean) {
    this._muted = value;
    localStorage.muted = value + "";
  }

  get muted(): boolean {
    return this._muted;
  }

  // ANSWER
  answerBanner = false;

  @action
  async answerIs({
    correct,
    powerOrNeg,
  }: {
    correct: boolean;
    powerOrNeg: boolean;
  }): Promise<void> {
    this.sendCommand({
      type: "ans",
      parameters: {
        correct,
        powerOrNeg,
      },
    });
  }

  // CONNECTION
  connection: WebSocket | null = null;
  connected = false;
  disconnected = true;

  @action
  async connect(host = false): Promise<void> {
    if (!this.disconnected) {
      this.addAlert("Already connecting");
    }
    this.join(host);
    this.disconnected = false;
  }

  @action
  async disconnect(): Promise<void> {
    this.connection?.close();
    this.connected = false;
    this.disconnected = true;
  }

  @action
  async join(host = false): Promise<void> {
    const JOIN_LOCAL_SOCKET = false;
    const SOCKET_URL = JOIN_LOCAL_SOCKET
      ? "ws://localhost:80"
      : "wss://holy-spirit-scholar-bowl-serve.herokuapp.com";
    let connection = new WebSocket(SOCKET_URL, "echo-protocol");
    this.connection = connection;

    connection.onopen = () => {
      this.connected = true;
      this.disconnected = false;
    };
    connection.onclose = (e) => {
      this.onClose({ e, host });
    };
    connection.onmessage = (e) => {
      this.onMessage({
        e,
        host,
      });
    };
    connection.onerror = (e) => {
      this.addAlert(`ERROR: ${e}`);
      console.error("error", e);
    };
  }

  @action
  async onMessage({
    e,
    host,
  }: {
    e: MessageEvent;
    host: boolean;
  }): Promise<void> {
    let msg = e.data as string;
    let data: ReceiveCommand<ReceiveCommands> = JSON.parse(msg);
    let { command } = data;

    let actions: {
      [key in ReceiveCommands]: (data: ReceiveCommand<ReceiveCommands>) => void;
    } = {
      buzz: (data) => this.onBuzz(data as ReceiveCommand<ReceiveCommands.buzz>),
      clear: () => this.onClear(),
      name: () => this.onName(host),
      success: () => this.addAlert("Successfully connected"),
      buzzer: (data) =>
        this.onBuzzer(data as ReceiveCommand<ReceiveCommands.buzzer>),
      online: (data) =>
        this.parseOnlineList(data as ReceiveCommand<ReceiveCommands.online>),
      chat: (data) => this.addChat(data.parameters as ReceiveChatParameters),
      host: (data) => this.onHost(data as ReceiveCommand<ReceiveCommands.host>),
      team: (data) =>
        this.onTeamCommand(data as ReceiveCommand<ReceiveCommands.team>),
    };

    if (Object.keys(actions).includes(command)) {
      actions[command](data);
    } else {
      this.addAlert(`Unknown message type: ${msg}`);
    }
  }

  @action
  async onTeamCommand(
    data: ReceiveCommand<ReceiveCommands.team>
  ): Promise<void> {
    this.setTeam(data.parameters.team);
    this.addAlert(`You have been placed on the ${this.team} team`);
  }

  @action
  async onClose({
    e,
    host,
    displayAlert = true,
    alertText = null,
  }: {
    e: CloseEvent;
    host: boolean;
    displayAlert?: boolean;
    alertText?: string | null;
  }): Promise<void> {
    if (e.code === 4001 && this.name.startsWith("Anonymous")) {
      this._name = `Anonymous${Math.floor(Math.random() * 100)}`;
      this.join(host);
      displayAlert = false;
    }

    if (e.code === 1000) displayAlert = false;

    let customMessages: Record<number, string> = {
      4000: "You've been kicked by the host",
      4001: "Someone else is using that name",
    };

    if (displayAlert) {
      let { code, wasClean } = e;
      let codeText = wasClean ? "" : ` (${code})`;
      alertText =
        alertText ?? customMessages[code] ?? `Connection closed${codeText}`;
      this.addAlert(alertText);
    }
    this.connected = false;
    this.disconnected = true;
  }

  @action
  async sendCommand<T extends SendCommandsKey>({
    type,
    parameters,
  }: {
    type: T;
    parameters: SendCommandParameters<T>;
  }): Promise<SendCommand<T>> {
    let command: SendCommand<T> = {
      command: type,
      parameters,
      sent: performance.now(),
      user: {
        name: this.name,
        realName: this.realName,
        team: this.team,
        host: this.host === this.name,
      },
    };
    this.connection?.send(JSON.stringify(command));
    return command;
  }

  // BUZZER
  host = "";
  activeBuzzer: string | null = null;

  @action
  async buzz(): Promise<void> {
    if (this.disconnected) {
      this.addAlert("You haven't connected yet!");
      return;
    }
    if (this.activeBuzzer === null) {
      this.sendCommand({
        type: "buzz",
        parameters: {
          buzzer: this.name,
        },
      });

      this.activeBuzzer = this.name;
      this.addAlert("You buzzed");
      this.answerBanner = true;
    } else {
      this.addAlert(
        `${
          this.activeBuzzer === this.name
            ? "You have"
            : `${this.activeBuzzer} has`
        } already buzzed`
      );
    }
  }

  @action
  async clear(): Promise<void> {
    if (this.disconnected) {
      this.addAlert("You haven't connected yet!");
      return;
    }
    this.sendCommand({
      type: "clear",
      parameters: null,
    });
    this.activeBuzzer = null;
    this.addAlert("You cleared");
  }

  @action
  async kick(who: string): Promise<void> {
    if (this.disconnected) {
      this.addAlert("You haven't connected yet!");
      return;
    }
    this.sendCommand({
      type: "kick",
      parameters: {
        name: who,
      },
    });
    this.addAlert(`You kicked ${who}`);
  }

  @action
  async addChat(params: ReceiveChatParameters): Promise<void> {
    let { name: author, message } = params;
    this.addAlert(`${author}: ${message}`);
  }

  @action
  async onBuzz(cmd: ReceiveCommand<ReceiveCommands.buzz>): Promise<void> {
    let from = cmd.parameters.buzzer;

    this.addAlert(`${from} buzzed`);
    this.activeBuzzer = from;

    let audio = document.getElementById("buzzerAudio") as HTMLAudioElement;
    if (!this.muted) audio.play();

    if (this.host === this.name) {
      this.answerBanner = true;
    }
  }

  @action
  async onClear(): Promise<void> {
    this.addAlert(`${this.host} cleared`);
    this.activeBuzzer = null;
  }

  @action
  async onName(host: boolean): Promise<void> {
    if (host) {
      this.host = this.name;
    }

    this.sendCommand({
      type: "name",
      parameters: null,
    });
  }

  @mutation
  onBuzzer(cmd: ReceiveCommand<ReceiveCommands.buzzer>): void {
    this.activeBuzzer = cmd.parameters.buzzer;
    if (this.activeBuzzer !== null) {
      this.answerBanner = true;
    }
  }

  @mutation
  onHost(cmd: ReceiveCommand<ReceiveCommands.host>): void {
    if (cmd.parameters.host === this.name) {
      this.addAlert("You are now the host");
    }
    this.host = cmd.parameters.host.trim();
  }

  @action
  async makeHost(user: string): Promise<void> {
    this.sendCommand({
      type: "host",
      parameters: {
        host: user,
      },
    });
    this.host = user;
  }

  @action
  async chat(message: string): Promise<void> {
    if (this.disconnected) {
      this.addAlert("You haven't connected yet");
    }

    this.sendCommand({
      type: "chat",
      parameters: {
        message: message,
      },
    });

    let chatData: ReceiveChatParameters = {
      message,
      name: this.name,
    };
    this.addChat(chatData);
  }

  // CHANGELOG
  get changelogVersion(): string {
    return this.changelog[0].version;
  }

  readonly changelog = changelog;

  // DEVELOPER MODE
  developerMode = false;

  @action
  async enableDeveloperMode(): Promise<void> {
    // cryptic regex...yay
    console.log(
      "The password will match the following regular expression: (h|H){1}e{1}l{2}o,?\\s{1}(w|W){1}[lro]{3}d{1}\\!?"
    );
    // If you're looking at this, feel free to enter. This message is just to deter others.
    let shouldContinue = confirm(
      "You are entering developer mode. Developer mode allows access to a set of backdoor commands that are normally not available. Please do not enter if you are not supposed to be here. If you are a developer, you know where to look to find the password."
    );
    if (!shouldContinue) return;
    let passedCheck = prompt("Please enter the password")?.match(
      /(h|H){1}e{1}l{2}o,?\s{1}(w|W){1}[lro]{3}d{1}!?/
    );

    if (passedCheck) {
      this.addAlert(
        "You have entered developer mode. With great power comes great responsibility"
      );
      this.developerMode = true;
    } else {
      this.addAlert(
        "Authentification failed. If you're not supposed to be messing around with this, please abstain from doing so."
      );
    }
  }
}

export const store = new Store({
  modules: {
    ...extractVuexModule(BuzzerStore),
  },
});

export const vxm = createProxy(store, BuzzerStore);
