const express = require("express");
const cors = require("cors");
const path = require("path");
const server = express();
const PORT = process.env.PORT || 8080;
const rootPath = path.join(__dirname, "/public");
var corsOptions = {
    origin: "https://weather-app-simple-clone.herokuapp.com/",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
server.use(express.json());
server.use(cors);
server.use(express.static(`${__dirname}/public`));
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

server.get("/", (req, res) => {
    res.sendFile("home.html", {
        root: rootPath,
    });
});
module.exports = server;
