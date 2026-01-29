const fs = require('fs');
const path = require('path');

const scenarioPath = path.join(__dirname, '../scenarios/mars_colony.json');

async function runScenario() {
    try {
        if (!fs.existsSync(scenarioPath)) {
            console.error(`Error: Scenario file not found at ${scenarioPath}`);
            return;
        }

        const scenarioData = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
        console.log("Loaded scenario:", scenarioData.setting);

        const response = await fetch('http://localhost:3000/api/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scenarioData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Simulation started successfully:", result);

    } catch (error) {
        console.error("Failed to run scenario:", error.message);
    }
}

runScenario();