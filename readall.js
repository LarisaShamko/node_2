const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const articlesPath = path.join(__dirname, 'data', 'articles.json');

const server = http.createServer((req, res) => {
    if (req.url === '/api/articles/readall' && req.method === 'GET') {
        fs.readFile(articlesPath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading data:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            try {
                const articles = JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(articles));
            } catch (parseErr) {
                console.error('Error parsing data:', parseErr);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log(`Server running at http://${3000}:${'127.0.0.1'}/`);
});