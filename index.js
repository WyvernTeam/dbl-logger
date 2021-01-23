const config = require("./config");
const process = require("./package.json");
const express = require("express");
const bodyparser = require("body-parser");
const { checkWebHook, postWebHook } = require("./utils/webhooks");

console.log(`Starting "\x1b[33m${process.name}\x1b[0m" app.\n\x1b[32mVersion:\x1b[0m ${process.version}\n\x1b[32mAuthor:\x1b[0m ${process.author}`);

async function configCheck() {
    console.log("Checking config...");
    let webhook_status = await checkWebHook(config.DISCORD_WEBHOOK);
    if (webhook_status) console.log("WebHook ok.");
    else throw "WEBHOOK ERROR";
}
configCheck();

console.log("Loading express server...");
let app = express();
let router = express.Router();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

router.post("webhook", (req, res) => {
    if (req.headers.authorization != config.AUTH) return res.json({ message: "403 Forbidden"}, 403);
    if (req.body.bot == undefined || config.BOTS[req.body.bot] == undefined) return res.json({ message: "400 Bad Request" }, 400);
    if (req.body.user == undefined) return res.json({ message: "400 Bad Request" }, 400);
    if (req.body.type == undefined) return res.json({ message: "400 Bad Request" }, 400);
    if (req.body.isWeekend == undefined) return res.json({ message: "400 Bad Request" }, 400);

    let message = ``
    postWebHook(config.DISCORD_WEBHOOK, message)
        .catch(error => { throw error; });
});

app.use(router);
app.listen(config.PORT, () => {
    console.log("Express server listening on port " + config.PORT);
});
