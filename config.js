`use strict`;

const secrets = require(`./secrets`);

const opts = {
    username: `feelsokaybot`,
    password: secrets.ircPassword,
};

let startupChannel = `aiazymeme`;
const prefix = `^`;
const defaultCooldown = `5000`; // 5 seconds
const ownerID = `103973901`; // ALazyMeme
const botID = `196500227`; // FeelsOkayBot
const channels = [
    `pajlada`,
    `kattah`,
    `aiazymeme`,
    `weest`,
    `forsen`,
];

module.exports = {
    opts,
    startupChannel,
    prefix,
    defaultCooldown,
    ownerID,
    botID,
    channels,
};
