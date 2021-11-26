const express = require("express");
const path = require("path");
const server = express();
const PORT = process.env.PORT || 8080;
const rootPath = path.join(__dirname, "/public");

server.use(express.json());
server.use(express.static(`${__dirname}/public`));
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

server.get("/", (req, res) => {
    res.sendFile("home.html", {
        root: rootPath,
    });
});
module.exports = server;
