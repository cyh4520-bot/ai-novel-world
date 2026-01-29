let characters = [
    { name: "Detective Miller", role: "Protagonist", traits: "Cunning, Cynical", goal: "Find the missing android" },
    { name: "Unit 734", role: "Sidekick", traits: "Loyal, Literal", goal: "Protect Miller" }
];

function renderCharacters() {
    const container = document.getElementById('characters-list');
    container.innerHTML = '<h3>Characters</h3>';
    characters.forEach((char, index) => {
        const div = document.createElement('div');
        div.className = 'character-card';
        div.innerHTML = `
            <strong>${char.name}</strong> (${char.role})<br>
            Traits: ${char.traits}<br>
            Goal: ${char.goal}
        `;
        container.appendChild(div);
    });
}

function addCharacter() {
    const name = prompt("Name:");
    if (!name) return;
    const role = prompt("Role (Protagonist, Antagonist, etc):", "Side Character");
    const traits = prompt("Traits (comma separated):", "Brave");
    const goal = prompt("Goal:", "Survive");
    characters.push({ name, role, traits, goal });
    renderCharacters();
}

async function startSimulation() {
    const setting = document.getElementById('setting').value;
    
    document.getElementById('setup').style.display = 'none';
    document.getElementById('simulation-view').style.display = 'block';
    
    const res = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting, characters })
    });
    
    if (res.ok) {
        pollStatus();
    }
}

async function pollStatus() {
    const logBox = document.getElementById('world-log');
    const statusText = document.getElementById('status-text');
    
    const interval = setInterval(async () => {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        // Update logs
        const logContent = data.logs.map(l => `[${l.timestamp.split('T')[1].split('.')[0]}] ${l.actor}: ${l.action}`).join('\n');
        logBox.innerText = logContent;
        logBox.scrollTop = logBox.scrollHeight;
        
        if (data.isFinished) {
            clearInterval(interval);
            statusText.innerText = "Simulation Complete!";
            setTimeout(() => {
                showResults(data.outline);
            }, 1000);
        }
    }, 1000);
}

function showResults(outline) {
    document.getElementById('simulation-view').style.display = 'none';
    document.getElementById('results-view').style.display = 'block';
    document.getElementById('outline-box').innerText = outline;
}

function reset() {
    document.getElementById('results-view').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
}

// Init
renderCharacters();
