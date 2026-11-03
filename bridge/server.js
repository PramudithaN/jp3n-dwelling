// bridge/server.js - Lightweight local HTTP bridge for Antigravity & After Effects
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const BRIDGE_DIR = __dirname;
const REQUEST_FILE = path.join(BRIDGE_DIR, 'request.json');
const RESPONSE_FILE = path.join(BRIDGE_DIR, 'response.json');

const server = http.createServer((req, res) => {
    // CORS headers for After Effects CEP panel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'connected', version: '1.0' }));
        return;
    }

    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(REQUEST_FILE, JSON.stringify(data, null, 2));
                console.log(`[Bridge] Received prompt from After Effects: "${data.prompt}"`);

                // Wait up to 60s for response.json
                const startTime = Date.now();
                const pollInterval = setInterval(() => {
                    if (fs.existsSync(RESPONSE_FILE)) {
                        try {
                            const responseContent = fs.readFileSync(RESPONSE_FILE, 'utf8');
                            const resp = JSON.parse(responseContent);
                            fs.unlinkSync(RESPONSE_FILE); // Clean up
                            clearInterval(pollInterval);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(resp));
                            return;
                        } catch (err) {}
                    }
                    if (Date.now() - startTime > 60000) {
                        clearInterval(pollInterval);
                        res.writeHead(504, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Timeout waiting for Antigravity response.' }));
                    }
                }, 500);

            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end();
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Bridge Server] Listening on http://127.0.0.1:${PORT}`);
});
