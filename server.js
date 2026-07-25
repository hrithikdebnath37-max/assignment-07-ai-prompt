const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;

const htmlPath = path.join(__dirname, "random.html");

const server = http.createServer((req, res) => {

    // ==========================
    // HOME PAGE
    // ==========================

    if (req.method === "GET" && req.url === "/") {

        fs.readFile(htmlPath, "utf8", (err, html) => {

            if (err) {

                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                return res.end("Internal Server Error");

            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(html.replace("__RESULT__", ""));

        });

    }

    // ==========================
    // POST ROUTE
    // ==========================

    else if (req.method === "POST" && req.url === "/ai") {

        let body = "";

        req.on("data", chunk => {

            body += chunk.toString();

        });

        req.on("end", () => {

            console.log(body);

            const formData = new URLSearchParams(body);

            const prompt = formData.get("prompt");

            console.log("Prompt:");

            console.log(prompt);

            fs.readFile(htmlPath, "utf8", (err, html) => {

                if (err) {

                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });

                    return res.end("Internal Server Error");

                }

                const updatedHTML = html.replace(
                    "__RESULT__",
                    `<h3>Your Prompt:</h3><p>${prompt}</p>`
                );

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(updatedHTML);

            });

        });

    }

    // ==========================
    // 404
    // ==========================

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