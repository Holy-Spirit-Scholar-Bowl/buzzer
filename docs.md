# Documentation
This documents how the buzzer system communicates with the server

- [Documentation](#documentation)
    - [Basics](#basics)
      - [Message format](#message-format)
    - [Steps](#steps)
      - [Handshake](#handshake)
      - [Events](#events)
        - [Buzzing](#buzzing)
        - [Clearing](#clearing)
        - [Points](#points)
        - [Online list](#online-list)
        - [Chat](#chat)
        - [Kicking](#kicking)
        - [Host changes](#host-changes)
        - [Teams](#teams)
    - [Developer mode](#developer-mode)
      - [Points](#points-1)
      - [Restart](#restart)
    - [To recap:](#to-recap)
      - [Any connected user may:](#any-connected-user-may)
      - [The host may:](#the-host-may)
      - [A developer may:](#a-developer-may)
      - [Table of commands](#table-of-commands)

### Basics
#### Message format
All messages are stringified JSON. The basic format is as follows:
```
{
  "command": string,
  "parameters": {
    key: any
  } | null;
  "sent": number;
  "user": {
    "name": string;
    "realName": string;
    "team": string;
    "host": boolean;
  }
}
```
Parameters are optional; setting the `parameters` property to `null` will indicate they are not necessary. The exact content of the parameters depends on the `command`--see below for related documentation. `sent` is the time in milliseconds when the command was sent.

`user` contains information about the user. It is present in all commands and left out of the command formats listed here.

The `command` property indicates what type of action is being sent. For example, if a user buzzes, the `command` will be `"buzz"`.

**A command may have a slightly different meaning depending on where it comes from** (client-to-server or server-to-client). In all cases, the meanings will be related and the commands can be distinguished by their recipients.
### Steps

#### Handshake
When a client connects (assuming the server accepts the connection; it may not if it rejects the origin), the server will initiate communication. It sends a `name` command without parameters. The client followes with a `name` command containing the nickname (or name; this is what is displayed on the online list), real name (this keeps track of points), and whether they are to become host in the `user` field of the command. For reference, the two commands are:
```
{
  "command": "name",
  "parameters": null
}
```
for the server, and 
```
{
  "command": "name",
  "parameters": null
}
```
for the client.

The server then processes the information and stores it. After it has updated internally, it will inform the new client of the system state. This is done by the `host` and `buzzer` commands, which notify the client of the current host and current buzzer, respectively. If there is not host, the `host` command will not be sent. If there is not a buzzer, the `buzzer` command will be sent with a parameter of `null`.
```
{
  "command": "host",
  "parameters": {
    "host": host
  }
}
```
```
{
  "command": "buzzer",
  "parameters": {
    "buzzer": buzzer | null
  }
}
```
Both commands are sent by the server to the client. If these are successful, the server will notify the client with the `success` command, which takes no parameters.

```
{
  "command": "success",
  "parameters": null
}
```

After these commands have been sent, the server will update the online list and send it to **all** clients. The online list is discussed in more detail below.

#### Events
After the handshake, no immediate messaging necessarily occurs. However, messaging will occur when **a** client needs to notify the server. In most cases, the server will relay the information to the other clients (it is assumed the client that contacted the server has already handled it). Below is a list of events and their respective command format.

##### Buzzing
When a buzz occurs, the client notifies the server with the `buzz` command (not to be used with the [`buzzer`](#handshake) command; `buzz` is used in real-time but [`buzzer`](#handshake) is not). The `buzz` command from the client to the server takes the following form:
```
{
  "command": "buzz",
  "parameters": {
    "buzzer": name
  }
}
```
`name` is the name of the client that buzzed. 

When the server receives this command, it will relay the **exact same command** to the other clients. Upon receiving the message, the clients will respond accordingly. Additionally, if a client is the host, they may respond to the buzz in two ways, both of which are discussed below.

##### Clearing
After a buzz, the host may clear the buzz. They do this by sending the `clear` command to the server. The `clear` command has no parameters:
```
{
  "command": "clear",
  "parameters": null
}
```
The server relays the **exact same command** to the other clients.

##### Points
Another thing the host can do after a buzz is send the `ans` command to designate how many points the user should gain (depending on whether they answered correctly). The `ans` command is slightly more complicated:
```
{
  "command": "ans",
  "parameters": {
    "correct": boolean,
    "powerOrNeg": boolean
  }
}
```
The server will update the internal [online list](#online-list)--which also keeps track of points--with this information. It will send out the online list, not the `ans` command.

The host may reset the scoreboard (set all scores to 0) by sending the `reset` command. It takes no parameters.
```
{
  "command": "reset",
  "parameters": null
}
```
All scores will be set back to 0 and the online list will be updated.

##### Online list
The online list is stored by the server. It is updated whenever a user joins, leaves, scores points, or is kicked. The `online` command is sent from the server to the clients and updates the online list.
```
{
  "command": "online",
  "parameters": {
    "online": [
      {
        "name": name,
        "points": points
      }
    ]
  }
}
```
Each client is contained in the `online` array.

##### Chat
Clients can chat with the `chat` command. The messages are not stored and are relayed with no modification from the server after they are received.
```
{
  "command": "chat",
  "parameters": {
    "message": message
  }
}
```

##### Kicking
The host may kick a user with the `kick` command. 
```
{
  "command": "kick",
  "parameters": {
    "name": name
  }
}
```
The user with the name `name` will be kicked (their connection will be closed).

##### Host changes
The host may make another user the host. In doing so, they will no longer be the host. This is done with the `host` command. It follows the same format as the `host` command sent by the server during the [handshake](#handshake). When it is sent, the server will relay it to the other clients.
```
{
  "command": "host",
  "parameters": {
    "host": host
  }
}
```

##### Teams
Users of the same team have the same number of points. The idea of a team is similar to that of a real name; the only difference is a user's team takes precedence over their real name. A user can set their own team through the handshake. The host can also set the teams of users with the `teams` command:
```
{
  "command": "teams",
  "parameters": {
    "users": [
      {
        name: name,
        team: team
      }
    ]
  }
}
```
Each user is contained in the `users` array. When the server receives this command, it notifies the other users, sending each of them a `team` command:
```
{
  "command": "team",
  "parameters": {
    team: team
  }
}
```

### Developer mode
Developer mode is a special mode intended for developers. It allows access to a set of functions not available to other users. Note that the server has no implementation of developer mode; determining whether a user may or may not use these commands is the sole responsibility of the client. Developer mode allows access to all the capabilities of the host, as well as the following commands:

#### Points
Sets the points of a user to a given value
```
{
  "command": "points",
  "parameters": {
    "name": name,
    "points: points
  }
}
```
`name` is the name of the user being affected and `points` is the new value of their points.

#### Restart
Restarts the server. Takes no parameters.
```
{
  "command": "restart",
  "parameters": null
}
```

### To recap:
#### Any connected user may:
1. Buzz
2. Chat

#### The host may:
1. Do anything a connected user can
2. Clear buzzes
3. Kick users
4. Award points
5. Reset the scoreboard
6. Make another user the host
7. Set teams

#### A developer may:
1. Do anything a host or connected user can
2. Restart the server
3. Set the points of a user
#### Table of commands
|          Command         | Sent by client |    Sent by server   |                    Notes                    |
|:------------------------:|:--------------:|:-------------------:|:-------------------------------------------:|
| [`host`](#host-changes)  | Yes            | Yes                 | Sent during handshake and by client         |
| [`name`](#handshake)     | Yes            | Yes                 | Multiple formats, sent during handshake     |
| [`buzz`](#buzzing)       | Yes            | When sent by client |                                             |
| [`clear`](#clearing)     | Yes            | When sent by client |                                             |
| [`chat`](#chat)          | Yes            | When sent by client |                                             |
| [`kick`](#kicking)       | Yes            | No                  |                                             |
| [`ans`](#points)         | Yes            | No                  |                                             |
| [`success`](#handshake)  | No             | Yes                 | Sent during handshake                       |
| [`online`](#online-list) | No             | Yes                 | Sent during handshake and on updates        |
| [`buzzer`](#handshake)   | No             | Yes                 | Sent during handshake                       |
| [`reset`](#the-host-may) | Yes            | No                  | Only sent by host                           |
| [`restart`](#restart)    | Yes            | No                  | Restarts the server, only in developer mode |
| [`points`](#points)      | Yes            | No                  | Sets the points of a user, only in dev mode |
| [`teams`](#teams)        | Yes            | No                  | Groups users into teams, only sent by host  |
| [`team`](#teams)         | No             | Yes                 | Sent after `teams`, sets team of user       |