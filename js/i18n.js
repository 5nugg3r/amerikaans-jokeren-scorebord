// === i18n - Internationalization Module ===

const i18n = {
    langs: {
        nl: {
            flagCode: 'nl',
            data: {
                app_title: "Amerikaans Jokeren",
                app_subtitle: "Scorebord",
                home_description: "Houd eenvoudig de score bij van jullie potje Amerikaans Jokeren.",
                rounds_title: "De 7 rondes",
                round_1: "Drie opvolgende kaarten",
                round_2: "Drie gelijke kaarten",
                round_3: "Vier opvolgende kaarten",
                round_4: "Vier gelijke kaarten",
                round_5: "Vijf opvolgende kaarten",
                round_6: "Zes opvolgende kaarten",
                round_7: "Alles in \u00e9\u00e9n keer",
                btn_new_game: "Nieuw spel starten",
                btn_start_game: "Spel starten",
                btn_add_player: "Toevoegen",
                btn_save: "Opslaan",
                btn_cancel: "Annuleren",
                btn_skip_round: "Ronde overslaan",
                btn_enter_scores: "Scores invoeren",
                setup_title: "Spelers instellen",
                setup_hint: "Voeg minimaal 2 spelers toe om te beginnen.",
                player_placeholder: "Naam van speler",
                dealer_title: "Deler",
                dealer_random: "Willekeurig",
                dealer_badge: "DELER",
                game_finished: "Spel afgelopen!",
                round_label: "Ronde",
                dealer_label: "Deler",
                total_label: "Totaal",
                points_suffix: "punten",
                points_title: "Puntentelling",
                joker_points: "Joker: 20 punten",
                face_card_points: "Plaatje (B/V/H): 10 punten",
                other_card_points: "Overige kaarten: 5 punten",
                joker_note: "Een joker telt als 10 punten als je niet hebt kunnen uitleggen.",
                qr_title: "Deel dit spel",
                qr_hint: "Scan de QR-code om het scorebord te bekijken",
                qr_alt: "QR-code naar dit spel",
                viewer_readonly: "Alleen-lezen weergave \u2014 ververs de QR-code voor updates",
                confirm_skip: 'Weet je zeker dat je "{round}" wilt overslaan?',
                error_one_zero: "Er moet precies \u00e9\u00e9n speler 0 punten hebben (de rondewinnaar).",
                error_max_one_zero: "Er kan maar \u00e9\u00e9n speler 0 punten hebben per ronde.",
                error_multiple_of_5: "De score van {player} moet een veelvoud van 5 zijn.",
                score_modal_title: "Ronde {num}: {round}",
                score_modal_edit_title: "Corrigeer {num}: {round}",
                move_up: "Omhoog",
                move_down: "Omlaag",
                remove: "Verwijderen"
            }
        },
        en: {
            flagCode: 'gb',
            data: {
                app_title: "American Rummy",
                app_subtitle: "Scoreboard",
                home_description: "Easily keep track of the score during your game of American Rummy.",
                rounds_title: "The 7 rounds",
                round_1: "Three consecutive cards",
                round_2: "Three of a kind",
                round_3: "Four consecutive cards",
                round_4: "Four of a kind",
                round_5: "Five consecutive cards",
                round_6: "Six consecutive cards",
                round_7: "All at once",
                btn_new_game: "Start new game",
                btn_start_game: "Start game",
                btn_add_player: "Add",
                btn_save: "Save",
                btn_cancel: "Cancel",
                btn_skip_round: "Skip round",
                btn_enter_scores: "Enter scores",
                setup_title: "Set up players",
                setup_hint: "Add at least 2 players to get started.",
                player_placeholder: "Player name",
                dealer_title: "Dealer",
                dealer_random: "Random",
                dealer_badge: "DEALER",
                game_finished: "Game over!",
                round_label: "Round",
                dealer_label: "Dealer",
                total_label: "Total",
                points_suffix: "points",
                points_title: "Scoring",
                joker_points: "Joker: 20 points",
                face_card_points: "Face card (J/Q/K): 10 points",
                other_card_points: "Other cards: 5 points",
                joker_note: "A joker counts as 10 points if you could not lay down your cards.",
                qr_title: "Share this game",
                qr_hint: "Scan the QR code to view the scoreboard",
                qr_alt: "QR code to this game",
                viewer_readonly: "Read-only view \u2014 rescan the QR code for updates",
                confirm_skip: 'Are you sure you want to skip "{round}"?',
                error_one_zero: "Exactly one player must have 0 points (the round winner).",
                error_max_one_zero: "Only one player can have 0 points per round.",
                error_multiple_of_5: "The score of {player} must be a multiple of 5.",
                score_modal_title: "Round {num}: {round}",
                score_modal_edit_title: "Correct {num}: {round}",
                move_up: "Move up",
                move_down: "Move down",
                remove: "Remove"
            }
        },
        fr: {
            flagCode: 'fr',
            data: {
                app_title: "Rami Am\u00e9ricain",
                app_subtitle: "Tableau des scores",
                home_description: "Suivez facilement le score de votre partie de Rami Am\u00e9ricain.",
                rounds_title: "Les 7 manches",
                round_1: "Trois cartes cons\u00e9cutives",
                round_2: "Trois cartes identiques",
                round_3: "Quatre cartes cons\u00e9cutives",
                round_4: "Quatre cartes identiques",
                round_5: "Cinq cartes cons\u00e9cutives",
                round_6: "Six cartes cons\u00e9cutives",
                round_7: "Tout d'un coup",
                btn_new_game: "Nouvelle partie",
                btn_start_game: "Commencer la partie",
                btn_add_player: "Ajouter",
                btn_save: "Enregistrer",
                btn_cancel: "Annuler",
                btn_skip_round: "Passer la manche",
                btn_enter_scores: "Saisir les scores",
                setup_title: "Configurer les joueurs",
                setup_hint: "Ajoutez au moins 2 joueurs pour commencer.",
                player_placeholder: "Nom du joueur",
                dealer_title: "Donneur",
                dealer_random: "Al\u00e9atoire",
                dealer_badge: "DONNEUR",
                game_finished: "Partie termin\u00e9e !",
                round_label: "Manche",
                dealer_label: "Donneur",
                total_label: "Total",
                points_suffix: "points",
                points_title: "D\u00e9compte des points",
                joker_points: "Joker : 20 points",
                face_card_points: "Figure (V/D/R) : 10 points",
                other_card_points: "Autres cartes : 5 points",
                joker_note: "Un joker compte pour 10 points si vous n'avez pas pu poser vos cartes.",
                qr_title: "Partager cette partie",
                qr_hint: "Scannez le QR code pour voir le tableau des scores",
                qr_alt: "QR code vers cette partie",
                viewer_readonly: "Vue en lecture seule \u2014 rescannez le QR code pour les mises \u00e0 jour",
                confirm_skip: "\u00cates-vous s\u00fbr de vouloir passer \u00ab {round} \u00bb ?",
                error_one_zero: "Exactement un joueur doit avoir 0 point (le gagnant de la manche).",
                error_max_one_zero: "Un seul joueur peut avoir 0 point par manche.",
                error_multiple_of_5: "Le score de {player} doit \u00eatre un multiple de 5.",
                score_modal_title: "Manche {num} : {round}",
                score_modal_edit_title: "Corriger {num} : {round}",
                move_up: "Monter",
                move_down: "Descendre",
                remove: "Supprimer"
            }
        },
        es: {
            flagCode: 'es',
            data: {
                app_title: "Rummy Americano",
                app_subtitle: "Marcador",
                home_description: "Lleva f\u00e1cilmente la puntuaci\u00f3n de tu partida de Rummy Americano.",
                rounds_title: "Las 7 rondas",
                round_1: "Tres cartas consecutivas",
                round_2: "Tres cartas iguales",
                round_3: "Cuatro cartas consecutivas",
                round_4: "Cuatro cartas iguales",
                round_5: "Cinco cartas consecutivas",
                round_6: "Seis cartas consecutivas",
                round_7: "Todo de una vez",
                btn_new_game: "Nueva partida",
                btn_start_game: "Empezar partida",
                btn_add_player: "A\u00f1adir",
                btn_save: "Guardar",
                btn_cancel: "Cancelar",
                btn_skip_round: "Saltar ronda",
                btn_enter_scores: "Introducir puntos",
                setup_title: "Configurar jugadores",
                setup_hint: "A\u00f1ade al menos 2 jugadores para empezar.",
                player_placeholder: "Nombre del jugador",
                dealer_title: "Repartidor",
                dealer_random: "Aleatorio",
                dealer_badge: "REPARTE",
                game_finished: "\u00a1Partida terminada!",
                round_label: "Ronda",
                dealer_label: "Repartidor",
                total_label: "Total",
                points_suffix: "puntos",
                points_title: "Puntuaci\u00f3n",
                joker_points: "Comod\u00edn: 20 puntos",
                face_card_points: "Figura (J/Q/K): 10 puntos",
                other_card_points: "Otras cartas: 5 puntos",
                joker_note: "Un comod\u00edn cuenta como 10 puntos si no pudiste bajar tus cartas.",
                qr_title: "Comparte esta partida",
                qr_hint: "Escanea el c\u00f3digo QR para ver el marcador",
                qr_alt: "C\u00f3digo QR de esta partida",
                viewer_readonly: "Vista de solo lectura \u2014 vuelve a escanear el QR para actualizar",
                confirm_skip: "\u00bfSeguro que quieres saltar \u00ab {round} \u00bb?",
                error_one_zero: "Exactamente un jugador debe tener 0 puntos (el ganador de la ronda).",
                error_max_one_zero: "Solo un jugador puede tener 0 puntos por ronda.",
                error_multiple_of_5: "La puntuaci\u00f3n de {player} debe ser m\u00faltiplo de 5.",
                score_modal_title: "Ronda {num}: {round}",
                score_modal_edit_title: "Corregir {num}: {round}",
                move_up: "Subir",
                move_down: "Bajar",
                remove: "Eliminar"
            }
        }
    },
    currentLang: 'nl',

    init() {
        // Determine language: saved > browser > default
        const saved = localStorage.getItem('aj_lang');
        if (saved && this.langs[saved]) {
            this.currentLang = saved;
        } else {
            const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
            if (this.langs[browserLang]) {
                this.currentLang = browserLang;
            }
        }

        this.renderSelector();
        this.translatePage();
    },

    t(key, params) {
        const val = this.langs[this.currentLang]?.data?.[key]
            || this.langs.nl.data?.[key]
            || key;
        if (!params) return val;
        return val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
    },

    setLang(code) {
        if (!this.langs[code]) return;
        this.currentLang = code;
        localStorage.setItem('aj_lang', code);
        this.translatePage();
        this.updateSelector();

        // Re-render active view
        const route = App.parseRoute();
        if (route.view === 'setup' && UI.currentGame) {
            UI.renderSetup();
        } else if (route.view === 'game' && UI.currentGame) {
            UI.renderGame();
        } else if (route.view === 'viewer' && UI.currentGame) {
            UI.renderViewer();
        }
    },

    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
        document.title = this.t('app_title') + ' - ' + this.t('app_subtitle');
    },

    renderSelector() {
        const toggle = document.getElementById('lang-toggle');
        const dropdown = document.getElementById('lang-dropdown');
        if (!toggle || !dropdown) return;

        // Set current flag on toggle button
        const current = this.langs[this.currentLang];
        toggle.innerHTML = `<img src="https://flagcdn.com/w40/${current.flagCode}.png" alt="${this.currentLang.toUpperCase()}" width="24" height="16"><span class="lang-arrow">&#9662;</span>`;

        // Build dropdown options (excluding current)
        dropdown.innerHTML = Object.entries(this.langs).map(([code, lang]) =>
            `<button class="lang-option" data-lang="${code}"><img src="https://flagcdn.com/w40/${lang.flagCode}.png" alt="${code.toUpperCase()}" width="24" height="16"></button>`
        ).join('');

        // Toggle dropdown
        toggle.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Select language
        dropdown.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLang(btn.dataset.lang);
                dropdown.classList.add('hidden');
            });
        });

        // Close on outside click
        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });
    },

    updateSelector() {
        const toggle = document.getElementById('lang-toggle');
        if (!toggle) return;
        const current = this.langs[this.currentLang];
        toggle.innerHTML = `<img src="https://flagcdn.com/w40/${current.flagCode}.png" alt="${this.currentLang.toUpperCase()}" width="24" height="16"><span class="lang-arrow">&#9662;</span>`;
    }
};
