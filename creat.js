const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const articlesPath = path.join(__dirname, 'articles.json');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/articles/create') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newArticle = JSON.parse(body); 

                fs.readFile(articlesPath, 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        return;
                    }

                    const articles = JSON.parse(data); 

                    const article = {
                        id: newArticle.id,
                        title: newArticle.title,
                        text: newArticle.text,
                        date: newArticle.date, 
                        author: newArticle.author,
                        comments: [] 
                    };

                    articles.push(article);

                    fs.writeFile(articlesPath, JSON.stringify(articles, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Internal Server Error' }));
                            return;
                        }

                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(article));
                    });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});