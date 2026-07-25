const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PORT = 5000;
const API_KEY = process.env.GROQ_API_KEY;

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
    // AI ROUTE
    // ==========================

    else if (req.method === "POST" && req.url === "/ai") {

        let body = "";

        req.on("data", chunk => {

            body += chunk.toString();

        });

        req.on("end", async () => {

            const formData = new URLSearchParams(body);

            const prompt = formData.get("prompt");

            try {

                const response = await fetch(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${API_KEY}`
                        },

                        body: JSON.stringify({

                            model: "llama-3.1-8b-instant",

                            messages: [
                                {
                                    role: "user",
                                    content: prompt
                                }
                            ]

                        })

                    }
                );

                const data = await response.json();

                const aiResponse =
                    data.choices?.[0]?.message?.content ||
                    "No response generated.";

                fs.readFile(htmlPath, "utf8", (err, html) => {

                    if (err) {

                        res.writeHead(500, {
                            "Content-Type": "text/plain"
                        });

                        return res.end("Internal Server Error");

                    }

                    const updatedHTML = html.replace(
                        "__RESULT__",

                        `
                        <h2>AI Response</h2>

                        <p>${aiResponse}</p>
                        `
                    );

                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });

                    res.end(updatedHTML);

                });

            } catch (error) {

                fs.readFile(htmlPath, "utf8", (err, html) => {

                    if (err) {

                        res.writeHead(500, {
                            "Content-Type": "text/plain"
                        });

                        return res.end("Internal Server Error");

                    }

                    const updatedHTML = html.replace(

                        "__RESULT__",

                        `
                        <h2>Error</h2>

                        <p>${error.message}</p>
                        `
                    );

                    res.writeHead(500, {
                        "Content-Type": "text/html"
                    });

                    res.end(updatedHTML);

                });

            }

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