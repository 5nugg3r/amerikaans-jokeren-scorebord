// === Amerikaans Jokeren - UI Logic ===

const UI = {
    currentGame: null,
    editingRound: null,
    isViewer: false,

    // DOM helpers
    $(id) { return document.getElementById(id); },

    showView(name) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        this.$('view-' + name).classList.remove('hidden');
    },

    // === Initialize ===
    init() {
        this.bindEvents();
        this.handleRoute();
        window.addEventListener('hashchange', () => this.handleRoute());
    },

    bindEvents() {
        // Home
        this.$('btn-new-game').addEventListener('click', () => this.onNewGame());

        // Setup
        this.$('btn-add-player').addEventListener('click', () => this.onAddPlayer());
        this.$('input-player-name').addEventListener('keydown', e => {
            if (e.key === 'Enter') this.onAddPlayer();
        });
        this.$('btn-start-game').addEventListener('click', () => this.onStartGame());

        // Score modal
        this.$('btn-cancel-scores').addEventListener('click', () => this.closeModal('modal-scores'));
        this.$('btn-save-scores').addEventListener('click', () => this.onSaveScores());
        this.$('modal-scores').querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal('modal-scores'));

        // Winner modal
        this.$('btn-new-game-end').addEventListener('click', () => this.onNewGame());
        this.$('modal-winner').querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal('modal-winner'));
    },

    // === Routing ===
    handleRoute() {
        const route = App.parseRoute();

        if (route.view === 'setup') {
            this.currentGame = App.loadGame(route.gameId);
            if (!this.currentGame) {
                window.location.hash = '';
                return;
            }
            if (this.currentGame.status !== 'setup') {
                window.location.hash = 'game/' + this.currentGame.id;
                return;
            }
            this.showView('setup');
            this.renderSetup();
        } else if (route.view === 'game') {
            this.currentGame = App.loadGame(route.gameId);
            if (!this.currentGame) {
                window.location.hash = '';
                return;
            }
            if (this.currentGame.status === 'setup') {
                window.location.hash = 'game/' + this.currentGame.id + '/setup';
                return;
            }
            this.isViewer = false;
            this.showView('game');
            this.renderGame();
        } else if (route.view === 'viewer') {
            this.currentGame = route.game;
            this.isViewer = true;
            this.showView('game');
            this.renderViewer();
        } else {
            this.currentGame = null;
            this.showView('home');
        }
    },

    // === Home ===
    onNewGame() {
        const game = App.createGame();
        window.location.hash = 'game/' + game.id + '/setup';
    },

    // === Setup ===
    onAddPlayer() {
        const input = this.$('input-player-name');
        const name = input.value.trim();
        if (!name) return;
        if (this.currentGame.players.length >= 20) return;

        App.addPlayer(this.currentGame, name);
        input.value = '';
        input.focus();
        this.renderSetup();
    },

    renderSetup() {
        const game = this.currentGame;
        const list = this.$('player-list');
        const hasEnough = game.players.length >= 2;

        // Render player list
        list.innerHTML = game.players.map((name, i) => `
            <div class="player-item" data-index="${i}">
                <span class="player-number">${i + 1}.</span>
                <span class="player-name">${this.escapeHtml(name)}</span>
                <div class="player-actions">
                    <button class="btn btn-secondary btn-icon" onclick="UI.onMovePlayer(${i}, -1)" ${i === 0 ? 'disabled' : ''} title="Omhoog">&uarr;</button>
                    <button class="btn btn-secondary btn-icon" onclick="UI.onMovePlayer(${i}, 1)" ${i === game.players.length - 1 ? 'disabled' : ''} title="Omlaag">&darr;</button>
                    <button class="btn btn-danger btn-icon" onclick="UI.onRemovePlayer(${i})" title="Verwijderen">&times;</button>
                </div>
            </div>
        `).join('');

        // Show/hide dealer section and start button
        const dealerSection = this.$('dealer-section');
        const setupActions = this.$('setup-actions');
        const hint = this.$('setup-hint');

        if (hasEnough) {
            dealerSection.classList.remove('hidden');
            setupActions.classList.remove('hidden');
            hint.classList.add('hidden');
            this.renderDealerOptions();
        } else {
            dealerSection.classList.add('hidden');
            setupActions.classList.add('hidden');
            hint.classList.remove('hidden');
        }
    },

    renderDealerOptions() {
        const game = this.currentGame;
        const container = this.$('dealer-player-options');
        container.innerHTML = game.players.map((name, i) => `
            <label class="dealer-option">
                <input type="radio" name="dealer" value="${i}" ${game.dealerIndex === i ? 'checked' : ''} onchange="UI.onDealerChange(${i})">
                <span>${this.escapeHtml(name)}</span>
            </label>
        `).join('');

        const randomRadio = document.querySelector('input[name="dealer"][value="random"]');
        if (game.dealerIndex < 0) {
            randomRadio.checked = true;
        }
        randomRadio.onchange = () => {
            App.setDealer(game, -1);
        };
    },

    onMovePlayer(index, direction) {
        App.movePlayer(this.currentGame, index, index + direction);
        this.renderSetup();
    },

    onRemovePlayer(index) {
        App.removePlayer(this.currentGame, index);
        this.renderSetup();
    },

    onDealerChange(index) {
        App.setDealer(this.currentGame, index);
    },

    onStartGame() {
        if (App.startGame(this.currentGame)) {
            window.location.hash = 'game/' + this.currentGame.id;
        }
    },

    // === Game / Scoreboard ===
    renderGame() {
        const game = this.currentGame;
        this.renderRoundInfo();
        this.renderScoreboard();
        this.renderGameActions();
        this.renderQRCode();

        if (game.status === 'finished') {
            this.showWinner();
        }
    },

    // Read-only viewer for shared URL
    renderViewer() {
        const game = this.currentGame;
        this.renderRoundInfo();
        this.renderScoreboard();
        this.$('game-actions').innerHTML = '<p style="color: #64748b; text-align: center;">Alleen-lezen weergave — ververs de QR-code voor updates</p>';
        this.$('qr-container').classList.add('hidden');

        if (game.status === 'finished') {
            this.showWinner();
        }
    },

    renderRoundInfo() {
        const game = this.currentGame;
        const info = this.$('round-info');
        if (game.status === 'finished') {
            info.textContent = 'Spel afgelopen!';
        } else {
            const roundNum = game.currentRound + 1;
            const roundName = ROUNDS[game.currentRound];
            const dealerIndex = App.getDealerForRound(game, game.currentRound);
            const dealerName = game.players[dealerIndex];
            info.innerHTML = `Ronde ${roundNum}: ${roundName}<br><span style="font-size: 0.875rem; color: #64748b;">Deler: ${this.escapeHtml(dealerName)}</span>`;
        }
    },

    renderScoreboard() {
        const game = this.currentGame;
        const totals = App.getTotals(game);

        // Current round dealer
        const currentDealerIndex = game.status !== 'finished'
            ? App.getDealerForRound(game, game.currentRound)
            : -1;

        // Head
        this.$('scoreboard-head').innerHTML = `<tr>
            <th>Ronde</th>
            ${game.players.map((name, i) => {
                const isDealer = i === currentDealerIndex;
                return `<th${isDealer ? ' class="dealer-header"' : ''}>${this.escapeHtml(name)}${isDealer ? '<span class="dealer-badge">DELER</span>' : ''}</th>`;
            }).join('')}
        </tr>`;

        // Body
        this.$('scoreboard-body').innerHTML = ROUNDS.map((round, ri) => {
            const isCurrent = ri === game.currentRound && game.status === 'playing';
            const isFuture = ri > game.currentRound - 1 && ri >= game.scores.length;
            const hasScores = ri < game.scores.length;
            let rowClass = '';
            if (isCurrent && !hasScores) rowClass = 'current-round';
            else if (isFuture && !hasScores) rowClass = 'future-round';

            const editable = hasScores && !this.isViewer;
            return `<tr class="${rowClass}"${editable ? ` onclick="UI.openEditModal(${ri})" style="cursor:pointer"` : ''}>
                <td>${ri + 1}. ${round}${editable ? ' <span class="edit-hint">&#9998;</span>' : ''}</td>
                ${game.players.map((_, pi) => {
                    if (hasScores) {
                        return `<td>${game.scores[ri][pi]}</td>`;
                    }
                    return `<td>-</td>`;
                }).join('')}
            </tr>`;
        }).join('');

        // Foot (totals)
        const minScore = game.scores.length > 0 ? Math.min(...totals) : null;
        this.$('scoreboard-foot').innerHTML = `<tr>
            <td>Totaal</td>
            ${totals.map((total, i) => {
                const isWinner = game.status === 'finished' && total === minScore;
                return `<td${isWinner ? ' class="winner-total"' : ''}>${total}</td>`;
            }).join('')}
        </tr>`;
    },

    renderGameActions() {
        const game = this.currentGame;
        const container = this.$('game-actions');

        if (game.status === 'playing') {
            container.innerHTML = `<button class="btn btn-primary btn-large" onclick="UI.openScoreModal()">Scores invoeren</button>`;
        } else if (game.status === 'finished') {
            container.innerHTML = `<button class="btn btn-primary btn-large" onclick="UI.onNewGame()">Nieuw spel starten</button>`;
        }
    },

    // === Score Modal ===
    openScoreModal() {
        const game = this.currentGame;
        if (game.status !== 'playing') return;
        this.editingRound = null;
        this._openScoreModal(game.currentRound, null);
    },

    openEditModal(roundIndex) {
        const game = this.currentGame;
        if (roundIndex >= game.scores.length) return;
        this.editingRound = roundIndex;
        this._openScoreModal(roundIndex, game.scores[roundIndex]);
    },

    _openScoreModal(roundIndex, existingScores) {
        const game = this.currentGame;
        const roundNum = roundIndex + 1;
        const roundName = ROUNDS[roundIndex];
        const isEdit = existingScores !== null;
        this.$('modal-round-title').textContent = `${isEdit ? 'Corrigeer' : 'Ronde'} ${roundNum}: ${roundName}`;

        this.$('score-inputs').innerHTML = game.players.map((name, i) => `
            <div class="score-input-row">
                <label for="score-${i}">${this.escapeHtml(name)}</label>
                <input type="number" id="score-${i}" min="0" step="5" value="${isEdit ? existingScores[i] : 0}" inputmode="numeric">
            </div>
        `).join('');

        // Remove any previous validation error
        const prevError = this.$('score-validation-error');
        if (prevError) prevError.remove();

        this.$('modal-scores').classList.remove('hidden');

        const firstInput = this.$('score-0');
        if (firstInput) {
            firstInput.select();
            firstInput.focus();
        }
    },

    onSaveScores() {
        const game = this.currentGame;
        const scores = game.players.map((_, i) => {
            const input = this.$('score-' + i);
            return Math.max(0, parseInt(input.value) || 0);
        });

        // Validatie: precies één speler moet 0 punten hebben
        const zeroCount = scores.filter(s => s === 0).length;
        if (zeroCount === 0) {
            this.showValidationError('Er moet precies één speler 0 punten hebben (de rondewinnaar).');
            return;
        }
        if (zeroCount > 1) {
            this.showValidationError('Er kan maar één speler 0 punten hebben per ronde.');
            return;
        }

        // Validatie: alle niet-nul scores moeten een veelvoud van 5 zijn
        const invalidPlayer = scores.findIndex((s, i) => s !== 0 && s % 5 !== 0);
        if (invalidPlayer >= 0) {
            this.showValidationError(`De score van ${game.players[invalidPlayer]} moet een veelvoud van 5 zijn.`);
            return;
        }

        if (this.editingRound !== null) {
            App.updateScores(game, this.editingRound, scores);
            this.editingRound = null;
        } else {
            App.submitScores(game, scores);
        }
        this.closeModal('modal-scores');
        this.renderGame();
    },

    showValidationError(message) {
        let errorEl = this.$('score-validation-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.id = 'score-validation-error';
            errorEl.className = 'validation-error';
            this.$('score-inputs').after(errorEl);
        }
        errorEl.textContent = message;
    },

    // === Winner ===
    showWinner() {
        const winner = App.getWinner(this.currentGame);
        this.$('winner-info').innerHTML = `
            <div class="winner-name">${this.escapeHtml(winner.name)}</div>
            <div class="winner-score">${winner.score} punten</div>
        `;
        this.$('modal-winner').classList.remove('hidden');
    },

    // === QR Code ===
    renderQRCode() {
        const container = this.$('qr-code');
        container.innerHTML = '';
        const encoded = App.encodeGameState(this.currentGame);
        if (!encoded) return;
        const url = window.location.href.split('#')[0] + '#view/' + encoded;

        if (typeof qrcode !== 'undefined') {
            const qr = qrcode(0, 'M');
            qr.addData(url);
            qr.make();
            const img = document.createElement('img');
            img.src = qr.createDataURL(4, 8);
            img.alt = 'QR-code naar dit spel';
            container.appendChild(img);
        } else {
            container.textContent = url;
        }
    },

    // === Helpers ===
    closeModal(id) {
        this.$(id).classList.add('hidden');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => UI.init());
