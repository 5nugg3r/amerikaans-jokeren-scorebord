// === Amerikaans Jokeren - App Logic ===

const ROUND_KEYS = ['round_1', 'round_2', 'round_3', 'round_4', 'round_5', 'round_6', 'round_7'];

function getRounds() {
    return ROUND_KEYS.map(key => i18n.t(key));
}

const App = {
    // Generate a GUID
    generateId() {
        return crypto.randomUUID();
    },

    // localStorage helpers
    loadGame(id) {
        try {
            const data = localStorage.getItem('aj_game_' + id);
            if (!data) return null;
            const game = JSON.parse(data);
            if (!game || typeof game !== 'object' || !Array.isArray(game.players) || !Array.isArray(game.scores)) {
                return null;
            }
            return game;
        } catch {
            return null;
        }
    },

    saveGame(game) {
        localStorage.setItem('aj_game_' + game.id, JSON.stringify(game));
    },

    // Create a new game
    createGame() {
        const id = this.generateId();
        const game = {
            id,
            players: [],
            dealerIndex: -1,
            currentRound: 0,
            scores: [],
            status: 'setup',
            createdAt: new Date().toISOString()
        };
        this.saveGame(game);
        return game;
    },

    // Add player to game
    addPlayer(game, name) {
        game.players.push(name);
        this.saveGame(game);
    },

    // Remove player from game
    removePlayer(game, index) {
        game.players.splice(index, 1);
        if (game.dealerIndex >= game.players.length) {
            game.dealerIndex = -1;
        }
        this.saveGame(game);
    },

    // Move player in order
    movePlayer(game, fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= game.players.length) return;
        const [player] = game.players.splice(fromIndex, 1);
        game.players.splice(toIndex, 0, player);
        this.saveGame(game);
    },

    // Set dealer
    setDealer(game, index) {
        game.dealerIndex = index;
        this.saveGame(game);
    },

    // Start the game
    startGame(game) {
        if (game.players.length < 2) return false;
        if (game.dealerIndex < 0 || game.dealerIndex >= game.players.length) {
            game.dealerIndex = Math.floor(Math.random() * game.players.length);
        }
        game.status = 'playing';
        game.currentRound = 0;
        game.scores = [];
        this.saveGame(game);
        return true;
    },

    // Submit scores for current round
    submitScores(game, roundScores) {
        game.scores.push(roundScores);
        game.currentRound = game.scores.length;
        if (game.currentRound >= ROUND_KEYS.length) {
            game.status = 'finished';
        }
        this.saveGame(game);
    },

    // Skip current round (store null)
    skipRound(game) {
        game.scores.push(null);
        game.currentRound = game.scores.length;
        if (game.currentRound >= ROUND_KEYS.length) {
            game.status = 'finished';
        }
        this.saveGame(game);
    },

    // Update scores for a previously completed round
    updateScores(game, roundIndex, roundScores) {
        game.scores[roundIndex] = roundScores;
        this.saveGame(game);
    },

    // Get cumulative totals
    getTotals(game) {
        const totals = new Array(game.players.length).fill(0);
        for (const round of game.scores) {
            if (!round) continue;
            for (let i = 0; i < round.length; i++) {
                totals[i] += round[i];
            }
        }
        return totals;
    },

    // Get dealer index for a specific round (skipped rounds don't advance the dealer)
    getDealerForRound(game, roundIndex) {
        let playedRounds = 0;
        for (let i = 0; i < roundIndex; i++) {
            if (game.scores[i] != null) {
                playedRounds++;
            }
        }
        return (game.dealerIndex + playedRounds) % game.players.length;
    },

    // Get winner (lowest score)
    getWinner(game) {
        const totals = this.getTotals(game);
        let minScore = Infinity;
        let winnerIndex = 0;
        for (let i = 0; i < totals.length; i++) {
            if (totals[i] < minScore) {
                minScore = totals[i];
                winnerIndex = i;
            }
        }
        return { name: game.players[winnerIndex], score: minScore, index: winnerIndex };
    },

    // Parse hash route
    parseRoute() {
        const hash = window.location.hash.slice(1);
        if (!hash) return { view: 'home' };

        const setupMatch = hash.match(/^game\/([a-f0-9-]+)\/setup$/);
        if (setupMatch) return { view: 'setup', gameId: setupMatch[1] };

        const gameMatch = hash.match(/^game\/([a-f0-9-]+)$/);
        if (gameMatch) return { view: 'game', gameId: gameMatch[1] };

        if (hash.startsWith('view/')) {
            const encoded = hash.slice(5);
            const game = this.decodeGameState(encoded);
            if (game) return { view: 'viewer', game };
        }

        return { view: 'home' };
    },

    // Encode game state to base64 URL-safe string
    encodeGameState(game) {
        const minimal = {
            p: game.players,
            d: game.dealerIndex,
            r: game.currentRound,
            s: game.scores,
            st: game.status
        };
        try {
            const json = JSON.stringify(minimal);
            return btoa(unescape(encodeURIComponent(json)));
        } catch {
            return null;
        }
    },

    // Decode game state from base64 URL-safe string
    decodeGameState(encoded) {
        try {
            const json = decodeURIComponent(escape(atob(encoded)));
            const minimal = JSON.parse(json);
            if (!minimal || !Array.isArray(minimal.p) || !Array.isArray(minimal.s)) {
                return null;
            }
            return {
                players: minimal.p,
                dealerIndex: minimal.d,
                currentRound: minimal.r,
                scores: minimal.s,
                status: minimal.st
            };
        } catch {
            return null;
        }
    }
};
