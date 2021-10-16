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

module.exports = {
    opts: opts,
    admins: adminIDs,
    startupChannel: startupChannel
};
