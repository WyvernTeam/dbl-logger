# DBL-Logger

Light-weight API to log Top.gg votes through a Discord WebHook using Express and node-fetch.

## How to install

Reproduce the following steps in order to install this API yourself.

**Requirements**:
```
- NGinx or Apache WebServer
- NodeJS & NPM
- A bot listed on the top.gg website
- A Discord bot token (Any) 
```
*Note*: I highly recommend not to use a personal user token as it may be regenerated due to many reasons and may cause a major security flaw for your Discord account.

1. Clone the repository and change to the created dir
```bash
git clone git@github.com:WyvernTeam/dbl-logger.git
cd dbl-logger
```

2. Install the dependencies
```
npm install
```

3. Copy the `config.exemple.js` file and paste it as `config.js` then edit it with the right values
```
cp config.exemple.js config.js
```

4. Start the app (you may want to use a Process Manager)
```
npm start
```

5. Setup a web server (This exemple will be with NGinx)

Use the following configuration
```
upstream api {
	server 127.0.0.1:PORT;
}

server {

	server_name domain.com;

	location / {
        include proxy_params;
        proxy_pass http://api;
    }

}
```

Then restart NGinx with `nginx -s reload`. *Your DNS should be pointing towards your webserver*

You should be good to go, use the https://domain.com/webhook URL for the vote logs to be posted to. (The `AUTH` value in the `config.js` file should be also referenced in your top.gg webhook config).