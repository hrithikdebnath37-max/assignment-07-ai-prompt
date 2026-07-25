const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {

        const filePath = path.join(__dirname, "random.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {

                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                return res.end("Internal Server Error");
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);

        });

    }

    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 Page Not Found");

    }

});

server.listen(PORT, () => {

    console.log(`Server Running : http://localhost:${PORT}`);

});