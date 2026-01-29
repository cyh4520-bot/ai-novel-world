const { v4: uuidv4 } = require('uuid');

class Simulation {
    constructor(setting, characters) {
        this.id = Date.now().toString(); // Simple ID
        this.setting = setting;
        this.characters = characters;
        this.logs = [];
        this.isFinished = false;
        this.outline = null;
        this.turnCount = 0;
        this.maxTurns = 10;
    }

    start() {
        console.log("Simulation started...");
        this.addLog("System", `Simulation started in ${this.setting}.`);
        
        // Simulate turns asynchronously to simulate "processing"
        const interval = setInterval(() => {
            this.runTurn();
            if (this.turnCount >= this.maxTurns) {
                clearInterval(interval);
                this.finish();
            }
        }, 500); // 0.5 second per turn
    }

    runTurn() {
        this.turnCount++;
        const turnLog = { turn: this.turnCount, events: [] };

        // Random event generator
        const eventChance = Math.random();
        let globalEvent = null;
        if (eventChance > 0.8) {
             globalEvent = this.getRandomGlobalEvent();
             this.addLog("World", globalEvent);
        }

        this.characters.forEach(char => {
            const action = this.decideAction(char, globalEvent);
            this.addLog(char.name, action);
            turnLog.events.push({ character: char.name, action });
        });
    }

    decideAction(char, globalEvent) {
        const actions = [
            "examines the surroundings.",
            "looks for clues.",
            "takes a deep breath.",
            "checks their inventory.",
            "thinks about their goal: " + char.goal,
            "wanders towards the horizon."
        ];
        
        const interactions = [
            "argues with",
            "shares a secret with",
            "helps",
            "ignores",
            "fights"
        ];

        // Interaction chance
        if (Math.random() > 0.6 && this.characters.length > 1) {
            const target = this.characters[Math.floor(Math.random() * this.characters.length)];
            if (target.name !== char.name) {
                const interaction = interactions[Math.floor(Math.random() * interactions.length)];
                return `${interaction} ${target.name}.`;
            }
        }

        if (globalEvent) {
            return `reacts to the ${globalEvent} with concern.`;
        }

        // Trait-based flavor
        if (char.traits.includes("Brave")) {
            return "charges forward fearlessly.";
        } else if (char.traits.includes("Shy")) {
            return "hides in the shadows.";
        }

        return actions[Math.floor(Math.random() * actions.length)];
    }

    getRandomGlobalEvent() {
        const events = [
            "sudden storm appearing",
            "mysterious sound echoing",
            "ground shaking slightly",
            "flock of birds flying overhead"
        ];
        return events[Math.floor(Math.random() * events.length)];
    }

    addLog(actor, action) {
        const timestamp = new Date().toISOString();
        this.logs.push({ timestamp, actor, action, turn: this.turnCount });
    }

    finish() {
        this.isFinished = true;
        this.addLog("System", "Simulation finished.");
        this.generateOutline();
    }

    generateOutline() {
        // Simple heuristic outline generator
        const chapters = [];
        let currentChapter = { title: "Chapter 1: The Beginning", content: [] };
        
        this.logs.forEach((log, index) => {
            if (index > 0 && index % 10 === 0) {
                 chapters.push(currentChapter);
                 currentChapter = { title: `Chapter ${chapters.length + 1}: Progression`, content: [] };
            }
            if (log.actor !== "System") {
                currentChapter.content.push(`${log.actor} ${log.action}`);
            }
        });
        chapters.push(currentChapter);

        this.outline = chapters.map(c => `### ${c.title}\n\n${c.content.join(' ')}`).join('\n\n');
        return this.outline;
    }
}

module.exports = { Simulation };
