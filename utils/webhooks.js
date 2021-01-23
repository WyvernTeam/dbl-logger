const fetch = require("node-fetch");

function checkWebHook(link) {
    return new Promise((resolve, reject) => {

        fetch(link, { method: "GET" })
            .then(response => response.json())
            .then(json => {
                if (json.message) resolve(false);
                resolve(true);
            }).catch(error => {
                reject(error);
            });

    });
}

function postWebHook(link, message) {
    return new Promise((resolve, reject) => {
        const data = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ content: message })
        }
        fetch(link, data)
            .then(response => {
                if (response.status == 400) reject("JSON_ERROR");
                resolve(true);
            });
    })
}

module.exports = { checkWebHook, postWebHook };