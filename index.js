const config = require("./config");
const process = require("./package.json");
const express = require("express");
const bodyparser = require("body-parser");
const { checkWebHook } = require("./utils/webhooks");

console.log(`Starting "\x1b[33m${process.name}\x1b[0m" app.\n\x1b[32mVersion:\x1b[0m ${process.version}\n\x1b[32mAuthor:\x1b[0m ${process.author}`);

async function configCheck() {
    console.log("Checking config...");
    let webhook_status = await checkWebHook(config.DISCORD_WEBHOOK);
    if (webhook_status) console.log("WebHook ok.");
    else throw "WEBHOOK ERROR";
}
configCheck();

console.log("Loading express server...");

