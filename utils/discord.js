const { json } = require("body-parser");
const fetch = require("node-fetch");
const { APP_TOKEN } = require("../config.js");

function getUserData(id) {
    return new Promise((resolve, reject) => {
        const data = {
            method: "GET",
            headers: { "Authorization": `Bot ${APP_TOKEN}` }
        };
        fetch(`https://discord.com/api/users/${id}`, data)
            .then(response => response.json())
            .then(json => {
                if (json.message != undefined) reject(json.message);
                resolve(json);
            })
            .catch(error => reject(error));
    });
}

module.exports = { getUserData }
