`use strict`;

const { ChatClient, AlternateMessageModifier } = require(`@kararty/dank-twitch-irc`);
const config = require(`./config`);
const client = new ChatClient(config.opts);
const talkedRecently = new Set();
const pajladaID = `11148817`;

function isUpperCase(str) {
  return str === str.toUpperCase();
};

function isLowerCase(str) {
  return str === str.toLowerCase();
};

client.use(new AlternateMessageModifier(client));
client.on(`ready`, () => console.log(`Successfully connected to chat`));
client.on(`close`, (error) => {
  if (error !== null) {
    console.error(`Client closed due to error`, error);
  }
});

client.on(`PRIVMSG`, (msg) => {
  console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
});

client.on(`message`, async (msg) => {
  // Ignore all messages from itself
  if (msg.senderUserID === config.botID) { 
    return;
  };

  const prefixExists = String(msg.messageText).startsWith(config.prefix); // Check if prefix exists at start of message
  const stripPrefix = String(msg.messageText).substring(1); // Strip the prefix from the message
  const msgText = String(msg.messageText).toLowerCase(); // Convert message to lowercase
  let cooldown = config.defaultCooldown;

  if (talkedRecently.has(msg.senderUserID) && !(msg.senderUserID === config.ownerID)) {
    return;
  } else {
    // Commands without prefixes
    // 82008718 = pajbot
    if (msg.senderUserID === `82008718` && msgText === `pajas 🚨 alert` && msg.channelID === pajladaID) {
      client.me(msg.channelName, `PAJAS 🚨 CUNTS`);
    };

    // 735710379 = borrowbot
    if (msg.senderUserID === `103973901` && msgText.startsWith(`/announce`)) {
      client.say(msg.channelName, `/announce ℱ`)
    }

    // 477589350 = slchbot
    if (msg.senderUserID === `477589350` && msgText === `pepegasit nevermind`) {
      client.say(msg.channelName, `alazymDank Slapp slchbot`)
    };

    if (msg.senderUserID === `477589350` && msgText === `pepea pajbot`) {
      client.say(msg.channelName, `monkaS it's coming`)
    };

    if (msgText.includes(`feelsokaybot`)) {
      client.say(msg.channelName, `pajaBing`);
    };

    if (msgText.split(" ")[0] === `test` && (msg.channelID === pajladaID || msg.channelID === config.ownerID)) {
      client.say(msg.channelName, `KKarrot test complete KKarrot`)
    };

    // Commands with prefixes
    if (prefixExists) {
      const noPrefix = stripPrefix.toLowerCase(); // Take the stripped message and convert to lowercase
      const command = noPrefix.split(' ')[0]; // Take the command name
      const noCommand = noPrefix.split(' ').slice(1) // Remove the command

      if (command === `ping`) {
        client.say(msg.channelName, `alazymDank 🏓 alazymHop 🏓 MrDestructoid`);
      };

      if (command === `echo` && msg.senderUserID === config.ownerID) {
        client.say(msg.channelName, stripPrefix.replace(/^echo/gi,``));
      };

      if (command == `pong`) {
        client.say(msg.channelName, `No pong 😡`)
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

client.on(`connect`, () => {
  client.say(config.startupChannel, `Walking!`)
});

client.connect();
client.joinAll(config.channels);
