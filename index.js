/**
 * Imported constants & modules
 */
const config = require("./config");
const process = require("./package.json");
const express = require("express");
const bodyparser = require("body-parser");
const { checkWebHook, postWebHook } = require("./utils/webhooks");
const { renderDate } = require("./utils/date");
const { getUserData } = require("./utils/discord");

/**
 * Display console info on the app on startup
 */
console.log(`Starting "\x1b[33m${process.name}\x1b[0m" app.\n\x1b[32mVersion:\x1b[0m ${process.version}\n\x1b[32mAuthor:\x1b[0m ${process.author}`);

/**
 * @function configCheck
 * @returns {null}
 * 
 * This function will check the config.js to avoid process errors
 */
async function configCheck() {
    console.log("Checking config...");
    // Checks if the specified WebHook sends a 200 Ok res.
    let webhook_status = await checkWebHook(config.DISCORD_WEBHOOK);
    if (webhook_status) console.log("WebHook ok.");
    else throw "WEBHOOK ERROR";
}
configCheck(); // Call the function right away

/**
 * Creates an express server to run the API on
 */
console.log("Loading express server...");
let app = express();
let router = express.Router();

/**
 * Allows json request to get through the API
 */
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

/**
 * @callback
 * 
 * This is the main endpoint of the WebHook,
 * it will process every requests sent by top.gg
 */
router.post("/webhook", async (req, res) => {
    /**
     * Checks the request to define how to
     * process it.
     */
    if (req.headers.authorization != config.AUTH) return res.status(403).json({ message: "403 Forbidden" });
    if (req.body.bot == undefined || config.BOTS[req.body.bot] == undefined) return res.status(400).json({ message: "400 Bad Request" });
    if (req.body.user == undefined) return res.status(400).json({ message: "400 Bad Request" });
    if (req.body.type == undefined) return res.status(400).json({ message: "400 Bad Request" });
    if (req.body.isWeekend == undefined) return res.status(400).json({ message: "400 Bad Request" });
    if (req.body.isWeekend == "true") req.body.isWeekend = true;
    if (req.body.isWeekend == "false") req.body.isWeekend = false;

    /**
     * Get data to include in the log message
     * [bot, user]
     */
    let bot = config.BOTS[req.body.bot];
    let user = await getUserData(req.body.user).catch(error => { throw error; });

    /**
     * Prepare the webhook request & log message 
     */
    let message = `\`[${renderDate()}]\` The user ${user.username}#${user.discriminator} \`(${req.body.user})\` has voted for the bot **${bot}**${(req.body.query != "") ? ` (Request Query: \`${req.body.query}\`)` : ""}. ${(req.body.isWeekend == true) ? `**This vote count as double since the weekend boost is applied.**` : ""}`;
    postWebHook(config.DISCORD_WEBHOOK, message)
        .catch(error => { throw error; });
    res.status(200).json({ message: "All clear !"});
});

/**
 * Start the express server
 */
app.use(router);
app.listen(config.PORT, () => {
    console.log("Express server listening on port " + config.PORT);
});
