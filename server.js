'use strict';
const express = require('express');
const { createCanvas } = require('canvas');
const path = require('path');

const app = express();
const port = process.env.PORT || 1337;

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get('/random-image', (req, res) => {
    const size = parseInt(req.query.size) || 3;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            ctx.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});