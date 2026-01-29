const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Simulation } = require('./simulation');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let currentSimulation = null;

// Start a new simulation
app.post('/api/start', (req, res) => {
    const { setting, characters } = req.body;
    currentSimulation = new Simulation(setting, characters);
    currentSimulation.start();
    res.json({ message: 'Simulation started', id: currentSimulation.id });
});

// Get simulation logs/status
app.get('/api/status', (req, res) => {
    if (!currentSimulation) {
        return res.status(404).json({ message: 'No active simulation' });
    }
    res.json({
        logs: currentSimulation.logs,
        isFinished: currentSimulation.isFinished,
        outline: currentSimulation.outline
    });
});

// Generate outline (trigger explicitly if needed, or get from status)
app.post('/api/generate-outline', (req, res) => {
    if (!currentSimulation) {
        return res.status(404).json({ message: 'No active simulation' });
    }
    const outline = currentSimulation.generateOutline();
    res.json({ outline });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
