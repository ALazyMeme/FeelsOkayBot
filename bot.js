"use strict";

const { ChatClient, AlternateMessageModifier } = require("dank-twitch-irc");
const config = require("./config");
const client = new ChatClient(config.opts);
const talkedRecently = new Set();

function isUpperCase(str) {
  return str === str.toUpperCase();
};

function isLowerCase(str) {
  return str === str.toLowerCase();
};

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
  // Ignore all messages from itself'
  if (msg.senderUserID === '196500227') { 
    return;
  };

  const prefixExists = String(msg.messageText).startsWith('^'); // Check if prefix exists at start of message
  const stripPrefix = String(msg.messageText).replace(/^\^/g, ''); // Strip the prefix from the message
  const msgText = String(msg.messageText).toLowerCase(); // Convert message to lowercase
  let cooldown = config.defaultCooldown;

  if (talkedRecently.has(msg.senderUserID) && !(msg.senderUserID === '103973901')) {
    return;
  } else {

    // Commands without prefixes
    if (msg.senderUserID === '82008718' && msgText === 'pajas 🚨 alert' && msg.channelID === '11148817') {
      client.me(msg.channelName, 'PAJAS 🚨 CUNTS');
    };

    if (msgText.includes('feelsokaybot')) {
      client.say(msg.channelName, 'why ping alazymDank');
    };

    // Commands with prefixes
    if (prefixExists) {
      const noPrefix = stripPrefix.toLowerCase(); // Take the stripped message and convert to lowercase

      if (noPrefix.startsWith('ping')) {
        client.say(msg.channelName, 'alazymDank 🏓 ppHop 🏓 MrDestructoid');
      };

      if (noPrefix.startsWith('echo') && msg.senderUserID === '103973901') {
        client.say(msg.channelName, stripPrefix.replace(/^echo/gi,''));
      };
    };

    // User is now in 5 second bot timeout
    talkedRecently.add(msg.senderUserID);
    setTimeout(() => {
      // Removes the user from the set after 5 seconds
      talkedRecently.delete(msg.senderUserID);
    }, cooldown);
  };
});

client.on("connect", () => {
  client.say(config.startupChannel, 'Walking!')
});

client.connect();
client.joinAll(config.channels);
