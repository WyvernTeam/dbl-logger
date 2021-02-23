/**
 * Imported constants & modules
 */
const { json } = require("body-parser");
const fetch = require("node-fetch");
const { APP_TOKEN } = require("../config.js");

/**
 * @function getUserData
 * @param {int} id The ID of the user to get the data from 
 * @returns {Promise} The user object attached to a promise
 * This function will get a user object from a Discord ID
 */
function getUserData(id) {
    /**
     * Return a promise to work asynchronously
     */
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
