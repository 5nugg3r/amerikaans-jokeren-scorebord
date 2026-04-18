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
        i18n.init();
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

        // Tooltip for truncated round names
        document.addEventListener('click', e => {
            const existing = document.querySelector('.round-tooltip');
            if (existing) existing.remove();
        });
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

        list.innerHTML = game.players.map((name, i) => `
            <div class="player-item" data-index="${i}">
                <span class="player-number">${i + 1}.</span>
                <span class="player-name">${this.escapeHtml(name)}</span>
                <div class="player-actions">
                    <button class="btn btn-secondary btn-icon" onclick="UI.onMovePlayer(${i}, -1)" ${i === 0 ? 'disabled' : ''} title="${i18n.t('move_up')}">&uarr;</button>
                    <button class="btn btn-secondary btn-icon" onclick="UI.onMovePlayer(${i}, 1)" ${i === game.players.length - 1 ? 'disabled' : ''} title="${i18n.t('move_down')}">&darr;</button>
                    <button class="btn btn-danger btn-icon" onclick="UI.onRemovePlayer(${i})" title="${i18n.t('remove')}">&times;</button>
                </div>
            </div>
        `).join('');

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

    renderViewer() {
        const game = this.currentGame;
        this.renderRoundInfo();
        this.renderScoreboard();
        this.$('game-actions').innerHTML = `<p style="color: #64748b; text-align: center;">${i18n.t('viewer_readonly')}</p>`;
        this.$('qr-container').classList.add('hidden');

        if (game.status === 'finished') {
            this.showWinner();
        }
    },

    renderRoundInfo() {
        const game = this.currentGame;
        const rounds = getRounds();
        const info = this.$('round-info');
        if (game.status === 'finished') {
            info.textContent = i18n.t('game_finished');
        } else {
            const roundNum = game.currentRound + 1;
            const roundName = rounds[game.currentRound];
            const dealerIndex = App.getDealerForRound(game, game.currentRound);
            const dealerName = game.players[dealerIndex];
            info.innerHTML = `${i18n.t('round_label')} ${roundNum}: ${roundName}<br><span style="font-size: 0.875rem; color: #64748b;">${i18n.t('dealer_label')}: ${this.escapeHtml(dealerName)}</span>`;
        }
    },

    renderScoreboard() {
        const game = this.currentGame;
        const rounds = getRounds();
        const totals = App.getTotals(game);

        const currentDealerIndex = game.status !== 'finished'
            ? App.getDealerForRound(game, game.currentRound)
            : -1;

        // Head
        this.$('scoreboard-head').innerHTML = `<tr>
            <th>${i18n.t('round_label')}</th>
            ${game.players.map((name, idx) => {
                const isDealer = idx === currentDealerIndex;
                return `<th${isDealer ? ' class="dealer-header"' : ''}>${this.escapeHtml(name)}${isDealer ? `<span class="dealer-badge">${i18n.t('dealer_badge')}</span>` : ''}</th>`;
            }).join('')}
        </tr>`;

        // Body
        this.$('scoreboard-body').innerHTML = rounds.map((round, ri) => {
            const isCurrent = ri === game.currentRound && game.status === 'playing';
            const isFuture = ri > game.currentRound - 1 && ri >= game.scores.length;
            const hasEntry = ri < game.scores.length;
            const isSkipped = hasEntry && game.scores[ri] === null;
            const hasScores = hasEntry && !isSkipped;
            let rowClass = '';
            if (isSkipped) rowClass = 'skipped-round';
            else if (isCurrent && !hasEntry) rowClass = 'current-round';
            else if (isFuture && !hasEntry) rowClass = 'future-round';

            const editable = hasEntry && !this.isViewer;
            return `<tr class="${rowClass}"${editable ? ` onclick="UI.openEditModal(${ri})" style="cursor:pointer"` : ''}>
                <td class="round-name" onclick="UI.showRoundTooltip(event, this)">${ri + 1}. ${round}${editable ? ' <span class="edit-hint">&#9998;</span>' : ''}</td>
                ${game.players.map((_, pi) => {
                    if (isSkipped) {
                        return `<td>-</td>`;
                    }
                    if (hasScores) {
                        return `<td>${game.scores[ri][pi]}</td>`;
                    }
                    return `<td>-</td>`;
                }).join('')}
            </tr>`;
        }).join('');

        // Foot
        const minScore = game.scores.length > 0 ? Math.min(...totals) : null;
        this.$('scoreboard-foot').innerHTML = `<tr>
            <td>${i18n.t('total_label')}</td>
            ${totals.map((total, idx) => {
                const isWinner = game.status === 'finished' && total === minScore;
                return `<td${isWinner ? ' class="winner-total"' : ''}>${total}</td>`;
            }).join('')}
        </tr>`;
    },

    renderGameActions() {
        const game = this.currentGame;
        const container = this.$('game-actions');

        if (game.status === 'playing') {
            container.innerHTML = `
                <button class="btn btn-primary btn-large" onclick="UI.openScoreModal()">${i18n.t('btn_enter_scores')}</button>
                <button class="btn btn-secondary btn-large" onclick="UI.onSkipRound()">${i18n.t('btn_skip_round')}</button>`;
        } else if (game.status === 'finished') {
            container.innerHTML = `<button class="btn btn-primary btn-large" onclick="UI.onNewGame()">${i18n.t('btn_new_game')}</button>`;
        }
    },

    // === Skip Round ===
    onSkipRound() {
        const game = this.currentGame;
        if (game.status !== 'playing') return;
        const rounds = getRounds();
        const roundName = rounds[game.currentRound];
        if (!confirm(i18n.t('confirm_skip', { round: roundName }))) return;
        App.skipRound(game);
        this.renderGame();
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
        const existing = game.scores[roundIndex];
        this._openScoreModal(roundIndex, existing);
    },

    _openScoreModal(roundIndex, existingScores) {
        const game = this.currentGame;
        const rounds = getRounds();
        const roundNum = roundIndex + 1;
        const roundName = rounds[roundIndex];
        const isEdit = existingScores !== null;
        const titleKey = isEdit ? 'score_modal_edit_title' : 'score_modal_title';
        this.$('modal-round-title').textContent = i18n.t(titleKey, { num: roundNum, round: roundName });

        this.$('score-inputs').innerHTML = game.players.map((name, idx) => `
            <div class="score-input-row">
                <label for="score-${idx}">${this.escapeHtml(name)}</label>
                <input type="number" id="score-${idx}" min="0" step="5" value="${isEdit ? existingScores[idx] : 0}" inputmode="numeric">
            </div>
        `).join('');

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
        const scores = game.players.map((_, idx) => {
            const input = this.$('score-' + idx);
            return Math.max(0, parseInt(input.value) || 0);
        });

        const zeroCount = scores.filter(s => s === 0).length;
        if (zeroCount === 0) {
            this.showValidationError(i18n.t('error_one_zero'));
            return;
        }
        if (zeroCount > 1) {
            this.showValidationError(i18n.t('error_max_one_zero'));
            return;
        }

        const invalidPlayer = scores.findIndex((s, idx) => s !== 0 && s % 5 !== 0);
        if (invalidPlayer >= 0) {
            this.showValidationError(i18n.t('error_multiple_of_5', { player: game.players[invalidPlayer] }));
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
            <div class="winner-score">${winner.score} ${i18n.t('points_suffix')}</div>
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
            img.alt = i18n.t('qr_alt');
            container.appendChild(img);
        } else {
            container.textContent = url;
        }
    },

    // === Helpers ===
    showRoundTooltip(e, cell) {
        e.stopPropagation();
        const existing = document.querySelector('.round-tooltip');
        if (existing) existing.remove();

        const rect = cell.getBoundingClientRect();
        const tooltip = document.createElement('div');
        tooltip.className = 'round-tooltip';
        tooltip.textContent = cell.textContent.replace(/\s*✎\s*$/, '');
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - 4) + 'px';
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 2500);
    },

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
