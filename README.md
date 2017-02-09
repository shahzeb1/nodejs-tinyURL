# NodeJS TinyURL Service
## Run your own URL shrinking service such as *bit.ly* or *goo.gl*.
###  Powered by Node.js, Express.js, and Reddis.

### Install:
-   `$ git clone git://github.com/shahzeb1/nodejs-tinyURL.git`
-   `$ cd nodejs-tinyURL`
-   Make sure you have [Node.js](http://nodejs.org/), and [Redis](http://redis.io/download) installed.
-   Run the `$ redis-server` command in a terminal window
-   Finally, run the application via `$ node app.js` in another terminal window
-   Visit `http://127.0.0.1:3000` to view the running application

### API:
-   `/tiny/[website.com]` — Returns json for a tinyed ID.
-   `/x/[id]` — Redirects to tinyed website.
-   `/stats/[id]` — Returns json of visits and the full URL.

### Example:
-   `$ curl http://127.0.0.1:3000/tiny/google.com`

> {"url":"google.com","id":"giMgC"}

-   `$ curl http://127.0.0.1:3000/stats/giMgC`

> {"id":"giMgC","views":"1","url":"google.com"}

Note: Inorder to use URL's with slashes use `encodeURIComponent(url)` and do not submit URL's with `http://` or `https://`

Enjoy!
