"use strict";

const { ChatClient, AlternateMessageModifier } = require("dank-twitch-irc");
const config = require("./config");
const client = new ChatClient(config.opts);
const talkedRecently = new Set()

client.use(new AlternateMessageModifier(client));
client.on("ready", () => console.log("Successfully connected to chat"));
client.on("close", (error) => {
  if (error !== null) {
    console.error("Client closed due to error", error);
  }
});

client.on("PRIVMSG", (msg) => {
  console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
});

client.on("message", (msg) => {
  if (msg.senderUserID === '196500227') { 
    return;
  };

  if (String(msg.messageText).toLowerCase().includes('feelsokaybot')) {
    client.say(msg.channelName, 'why ping alazymDank');
  };

  if (talkedRecently.has(msg.senderUserID) && !(msg.senderUserID === '103973901')) {
    return;
  } else {
    if (msg.senderUserID === '82008718' && msg.messageText === 'pajaS 🚨 ALERT') {
      client.me(msg.channelName, 'PAJAS 🚨 CUNTS');
    };

    if (String(msg.messageText).startsWith(`${config.prefix}ping`)) {
      client.say(msg.channelName, 'alazymDank 🏓 ppHop 🏓 MrDestructoid');
    };

    talkedRecently.add(msg.senderUserID);
    setTimeout(() => {
      // Removes the user from the set after 10 seconds
      talkedRecently.delete(msg.senderUserID);
    }, config.defaultCooldown);
  };
});

client.on("connect", () => {
  client.say(config.startupChannel, 'Walking!')
});

client.connect();
client.join("pajlada");
