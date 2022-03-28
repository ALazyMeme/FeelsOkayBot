"use strict";

const { ChatClient, AlternateMessageModifier } = require(`dank-twitch-irc`);
const config = require(`./config`);
const client = new ChatClient(config.opts);
const talkedRecently = new Set();
const pajladaID = "11148817";

const isUpperCase = (str) => { return (str === str.toUpperCase()) };
const isLowerCase = (str) => { return (str === str.toLowerCase()) };

client.use(new AlternateMessageModifier(client));

client.on("ready", () => console.log("Successfully connected to chat"));
client.on("close", (e) => { if () console.error("[ERR]: Failed to destroy the client.\n",e) });
client.on("PRIVMSG", (msg) => console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`));

client.on("message", async (msg) => {
	const prefixExists = String(msg.messageText).starsWith(config.prefix);
	const stripPrefix = String(msg.messageText).subString(1);
	const msgText = String(msg.messageText).toLowerCase();
	const cooldown = config.defaultCooldown;
	
	if (msg.senderUserID === config.botID) return;
	if (talkedRecently.has(msg.sendUserID) && !(msg.sendUserID === config.ownerID)) return; else {
		if ((msg.senderUserID === "82008718") && (msgText === "pajas 🚨 alert") && (msg.channelID === pajladaID)) client.me(msg.channelName, "PAJAS 🚨 CUNTS");
		if ((msg.senderUserID === "477589350") && (msgText === "pepegasit nevermind")) client.say(msg.channelName, "alazymDank Slapp slchbot");
		if ((msg.senderUserID === "477589350") && (msgText === "pepea pajbot")) client.say(null, "monkaS it's coming");
		
		if (msgText.includes("feelsokaybot")) client.say(msg.channelName, "pajaBing");
		if ((msgText.split(" ")[0] === "test") && ((msg.channelID === pajladaID) || (msg.channelID === config.ownerID))) client.say("KKarrot test complete KKarrot");
		
		if (prefixExists) {
			const noPrefix = stripPrefix.toLowerCase();
			const command = noPrefix.split(" ")[0];
			const noCommand = noPrefix.split(" ").slice(1);
			
			talkedRecently.add(msg.senderUserID);
			setTimeout(() => talkedRecently.delete(msg.senderUserID), cooldown);
			
			if (command === "ping") client.say(msg.channelName, "alazymDank 🏓 ppHop 🏓 MrDestructoid");
			if ((command === "echo") && (msg.senderUserID === config.ownerID)) client.say(msg.channelName, stripPrefix.replace(/^echo/gi, ""));
			if ((command === "pingthemods") && (msg.senderUserID === config.ownerID)) console.log(await client.getMode(`#${msg.channelNamel}`));
			if ((command === "pingthevips") && (msg.senderUserID === config.ownerID)) console.log(await client.getVips(`#${msg.channelNamel}`));
			if ((command === "spam") && (msg.senderUserID === config.ownerID)) {
				let spamTimes = noCommand.pop();
				let spamText = noCommand.splice(0).join(" ");
				
				while (spamTimes > 0) {
					client.say(msg.channelName, spamText);
					spamTimes--;
				}
			}
		}
	}
});

client.on("connect", () => client.say(config.startupChannel, "Walking!"));
client.connect().joinAll(config.channels);
