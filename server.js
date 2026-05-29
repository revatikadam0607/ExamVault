const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Serve static files from public folder
app.use(express.static('public'));

// Get all semesters
app.get('/semesters', (req, res) => {
  const dir = path.join(__dirname, 'public', 'uploads');
  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (err) return res.status(500).send('Unable to read semesters');
    const semesters = items.filter(i => i.isDirectory()).map(i => i.name);
    res.json(semesters);
  });
});

// Get subjects inside a semester
app.get('/semester/:sem/subjects', (req, res) => {
  const sem = req.params.sem;
  const dir = path.join(__dirname, 'public', 'uploads', sem);
  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (err) return res.status(500).send('Unable to read subjects');
    const subjects = items.filter(i => i.isDirectory()).map(i => i.name);
    res.json(subjects);
  });
});

// Get files inside a subject
app.get('/semester/:sem/:sub', (req, res) => {
  const sem = req.params.sem;
  const sub = req.params.sub;
  const dir = path.join(__dirname, 'public', 'uploads', sem, sub);
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).send('Unable to read files');
    res.json(files);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));