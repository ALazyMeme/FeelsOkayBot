"use strict";

const secrets = require("./secrets");

const opts = {
    username: "feelsokaybot",
    password: secrets.ircPassword,
};

let adminIDs = [
    "103973901" // ALazyMeme
]

let startupChannel = "alazymeme"
const prefix = '^'
const defaultCooldown = '10000' // 10 seconds

module.exports = {
    opts: opts,
    admins: adminIDs,
    startupChannel: startupChannel,
    prefix: prefix,
    defaultCooldown,
};
