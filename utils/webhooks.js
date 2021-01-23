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

module.exports = { checkWebHook };