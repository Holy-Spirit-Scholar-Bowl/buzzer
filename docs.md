## This is out of date

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
    - [To recap:](#to-recap)
      - [Any connected user may:](#any-connected-user-may)
      - [The host may:](#the-host-may)
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
  "sent": number
}
```
Parameters are optional; setting the `parameters` property to `null` will indicate they are not necessary. The exact content of the parameters depends on the `command`--see below for related documentation. `sent` is the time in milliseconds when the command was sent.

The `command` property indicates what type of action is being sent. For example, if a user buzzes, the `command` will be `"buzz"`.

**A command may have a slightly different meaning depending on where it comes from** (client-to-server or server-to-client). In all cases, the meanings will be related and the commands can be distinguished by their recipients.
### Steps

#### Handshake
When a client connects (assuming the server accepts the connection; it may not if it rejects the origin), the server will initiate communication. It sends a `name` command without parameters. The client followes with a `name` command containing the nickname (or name; this is what is displayed on the online list), real name (this keeps track of points), and whether they are to become host. For reference, the two commands are:
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
  "parameters": {
    "name": name,
    "realName": realName,
    "host": host
  }
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
    "name": name,
    "message": message
  }
}
```
`name` is the name of the client who sent the message.

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

### To recap:
#### Any connected user may:
1. Buzz
2. Chat

#### The host may:
1. Clear buzzes
2. Kick users
3. Award points
4. Reset the scoreboard
5. Make another user the host
6. Do anything a connected user can

#### Table of commands
|           Command        | Sent by client |    Sent by server   |                   Notes                 |
|:------------------------:|:--------------:|:-------------------:|:---------------------------------------:|
| [`host`](#host-changes)  | Yes            | Yes                 | Sent during handshake and by client     |
| [`name`](#handshake)     | Yes            | Yes                 | Multiple formats, sent during handshake |
| [`buzz`](#buzzing)       | Yes            | When sent by client |                                         |
| [`clear`](#clearing)     | Yes            | When sent by client |                                         |
| [`chat`](#chat)          | Yes            | When sent by client |                                         |
| [`kick`](#kicking)       | Yes            | No                  |                                         |
| [`ans`](#points)         | Yes            | No                  |                                         |
| [`success`](#handshake)  | No             | Yes                 | Sent during handshake                   |
| [`online`](#online-list) | No             | Yes                 | Sent during handshake and on updates    |
| [`buzzer`](#handshake)   | No             | Yes                 | Sent during handshake                   |