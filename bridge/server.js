// bridge/server.js - Non-blocking local bridge for Antigravity & After Effects
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const BRIDGE_DIR = __dirname;
const REQUEST_FILE = path.join(BRIDGE_DIR, 'request.json');
const RESPONSE_FILE = path.join(BRIDGE_DIR, 'response.json');

const server = http.createServer((req, res) => {
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
        res.end(JSON.stringify({ status: 'connected', version: '2.0' }));
        return;
    }

    // Submit new prompt from After Effects
    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                fs.writeFileSync(REQUEST_FILE, JSON.stringify(data, null, 2));
                console.log(`[Bridge] Prompt received: "${data.prompt}"`);

                // Check if response already exists
                if (fs.existsSync(RESPONSE_FILE)) {
                    const responseContent = fs.readFileSync(RESPONSE_FILE, 'utf8');
                    const resp = JSON.parse(responseContent);
                    fs.unlinkSync(RESPONSE_FILE);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(resp));
                    return;
                }

                // Non-blocking acknowledgement
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'queued',
                    message: 'Prompt queued in Antigravity workspace.'
                }));

            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // Poll for ready response
    if (req.url === '/poll' && req.method === 'GET') {
        if (fs.existsSync(RESPONSE_FILE)) {
            try {
                const responseContent = fs.readFileSync(RESPONSE_FILE, 'utf8');
                const resp = JSON.parse(responseContent);
                fs.unlinkSync(RESPONSE_FILE);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ready: true, ...resp }));
                return;
            } catch (err) {}
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ready: false }));
        return;
    }

    res.writeHead(404);
    res.end();
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`[Bridge Server v2] Listening on http://127.0.0.1:${PORT}`);
});
