`use strict`;

const { ChatClient, AlternateMessageModifier } = require(`@kararty/dank-twitch-irc`);
const config = require(`./config`);
const client = new ChatClient(config.opts);
const talkedRecently = new Set();
const pajladaID = `11148817`;
let pajbotAnnounce = false;

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

  const prefixExists = msg.messageText.startsWith(config.prefix); // Check if prefix exists at start of message
  const stripPrefix = msg.messageText.substring(1); // Strip the prefix from the message
  const msgText = msg.messageText.toLowerCase(); // Convert message to lowercase
  const stripWhitespace = stripPrefix.replace(/^\S+\s/,``) // Strip the whitespace from the start
  let cooldown = config.defaultCooldown;

  if (talkedRecently.has(msg.senderUserID) && !(msg.senderUserID === config.ownerID)) {
    return;
  } else {
    // Commands without prefixes
    // 82008718 = pajbot
    if (msg.senderUserID === `82008718` && msgText === `pajas 🚨 alert` && msg.channelID === pajladaID) {
      client.me(msg.channelName, `PAJAS 🚨 CUNTS`);
    };

    if (msg.senderUserID === `82008718` && msgText.startsWith(`/announce`)) {
      pajbotAnnounce = true;
      setTimeout(function () {
        pajbotAnnounce = false;
      }, 5*1000);
    };

    // 170141236 = SonnenBrot
    if (msg.senderUserID === `170141236` && msgText.startsWith(`/announce`)) {
      if (pajbotAnnounce) {
        let announceMessages = [`gopherDeadlock`, `/announce ℱ FeelsOkayMan`];
        let announceResponse = announceMessages[Math.floor(Math.random()*announceMessages.length)];
        client.say(msg.channelName, `${announceResponse}`)
      };
    };

    // 477589350 = slchbot
    if (msg.senderUserID === `477589350` && msgText === `pepegasit nevermind`) {
      client.say(msg.channelName, `alazymDank Slapp slchbot`)
    };

    if (msg.senderUserID === `477589350` && msgText === `pepea pajbot`) {
      client.say(msg.channelName, `monkaS it's coming`)
    };

    if (msgText.includes(`feelsokaybot`) && msg.channelID === pajladaID) {
      client.say(msg.channelName, `pajaBing`);
    };

    if (msgText.split(" ")[0] === `test` && (msg.channelID === pajladaID || msg.channelID === config.ownerID)) {
      client.say(msg.channelName, `KKarrot test complete KKarrot`)
    };

    // Commands with prefixes
    if (prefixExists) {
      const noPrefix = stripPrefix.toLowerCase(); // Take the stripped message and convert to lowercase
      const command = noPrefix.split(/\s+/)[0]; // Take the command name
      const noCommand = noPrefix.split(/\s+/).slice(1) // Remove the command

      if (command === `ping`) {
        client.reply(msg.channelName, msg.messageID, `alazymDank 🏓 alazymHop 🏓 MrDestructoid`);
      };

      if (command === `echo` && msg.senderUserID === config.ownerID) {
        client.say(msg.channelName, stripPrefix.replace(/^echo/gi,``));
      };

      if (command == `pong`) {
        client.reply(msg.channelName, msg.messageID, `No pong 😡`)
      };

      if (command == `st`) {
        client.reply(msg.channelName, msg.messageID, `https://www.smartraveller.gov.au/destinations/${encodeURIComponent(stripWhitespace.replace(/^st/gi,``))}`)
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
