(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const testMode = new URLSearchParams(location.search).get("test") === "1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storageKey = "love-quest-progress-v1";

  const questions = [
    { type: "souvenir secret", title: "Notre histoire", text: "Quel jour marque le début de notre histoire ?", answers: ["Le 14 février", "Le 25 août", "Le 7 janvier"], correct: 1, feedback: "Bien joué… tu n’as pas oublié notre date. ❤️" },
    { type: "complicité", title: "Entre nous", text: "Quand je te taquine, qu’est-ce que j’attends surtout ?", answers: ["Que tu abandonnes", "Que tu me répondes avec ton caractère", "Que tu partes dormir"], correct: 1, feedback: "Voilà, c’est cette complicité que j’aime. 😏" },
    { type: "cœur ouvert", title: "Une vérité", text: "Qu’est-ce qui rend notre relation précieuse ?", answers: ["Le fait de tout réussir parfaitement", "Le fait d’être nous, même à distance", "Le fait de ne jamais se parler"], correct: 1, feedback: "Même à distance, on continue d’écrire notre histoire. ❤️‍🩹" },
    { type: "défi", title: "Montre-moi", text: "Face à une énigme difficile, tu fais quoi ?", answers: ["J’essaie encore avec les indices", "Je ferme le jeu pour toujours", "Je demande à la lune"], correct: 0, feedback: "Je savais que tu n’allais pas lâcher. 🌙" },
    { type: "souvenir secret", title: "Une place à part", text: "Cette quête a été créée pour…", answers: ["N’importe qui", "Ya hayti, toi et personne d’autre", "Le premier venu"], correct: 1, feedback: "Exactement. Tout ça, c’est pour toi." },
    { type: "taquinerie", title: "Petite provocation", text: "Qui est censée connaître son homme par cœur ?", answers: ["Toi, évidemment 😏", "La lune", "Le voisin"], correct: 0, feedback: "Alors on va voir si tu assumes ce titre. 😈" },
    { type: "avenir", title: "Et demain ?", text: "Cette aventure parle aussi de…", answers: ["Un futur qu’on construit ensemble", "Une compétition", "Un voyage sur Mars"], correct: 0, feedback: "Pas besoin de tout connaître du futur pour avancer ensemble. 💍" },
    { type: "énigme", title: "La lune et le temps", text: "Je grandis quand tu trouves un fragment, je brille quand tu avances. Qui suis-je ?", answers: ["La lune de notre quête", "Une horloge", "Un coffre vide"], correct: 0, feedback: "Un fragment de plus pour notre lune. ✨" },
    { type: "cœur ouvert", title: "À distance", text: "Même loin l’un de l’autre, qu’est-ce qu’on peut partager ?", answers: ["Des souvenirs et des petites attentions", "Rien du tout", "Seulement la météo"], correct: 0, feedback: "Les kilomètres n’effacent pas les attentions." },
    { type: "défi", title: "Dernière ligne droite", text: "Si je te prépare une surprise, tu dois…", answers: ["Découvrir jusqu’au bout", "Lire la fin tout de suite", "Me laisser gagner"], correct: 0, feedback: "Continue, ya hayti. Le plus beau reste caché. 🌹" },
    { type: "secret", title: "Un coffre mystérieux", text: "Quel est le meilleur moyen d’ouvrir un secret ?", answers: ["La patience et la curiosité", "Un marteau", "Ne jamais essayer"], correct: 0, feedback: "Le coffre s’ouvre à celles qui persévèrent." },
    { type: "souvenir secret", title: "Notre petite bulle", text: "Qui peut comprendre chaque détail de notre histoire ?", answers: ["Tout le monde", "Nous deux, à notre façon", "Un inconnu"], correct: 1, feedback: "Il y a des choses qu’on n’a pas besoin d’expliquer." },
    { type: "cœur ouvert", title: "Un mot important", text: "Ce que je veux que tu ressentes ici, c’est…", answers: ["Que cette surprise est faite spécialement pour toi", "Que tu passes un examen scolaire", "Que tu es en retard"], correct: 0, feedback: "Parce que cette aventure porte ta trace." },
    { type: "ultime énigme", title: "Le dernier fragment", text: "Qu’est-ce qui complète vraiment cette lune ?", answers: ["Les fragments gagnés en chemin", "Un mot au hasard", "Attendre sans jouer"], correct: 0, feedback: "La lune se rapproche de son éclat final…" },
    { type: "dernière porte", title: "Prête pour la vérité ?", text: "Tu as suivi les indices. Tu veux découvrir la vraie surprise ?", answers: ["Oui, ouvre la dernière porte", "Pas encore, je veux recommencer"], correct: 0, feedback: "Alors regarde bien… ce qui vient est pour toi. ❤️‍🩹" }
  ];

  const rewards = [
    { at: 2, icon: "🌙", title: "Un fragment de lune", text: "Chaque petit pas compte. La lune commence à retrouver son éclat.", kind: "fragment" },
    { at: 4, icon: "📷", title: "Une mémoire secrète", text: "Choisis quelques photos pour les voir dans cette démonstration.", kind: "photo" },
    { at: 6, icon: "✉️", title: "Le coffret des messages", text: "Choisis une enveloppe selon ton humeur.", kind: "letters" },
    { at: 8, icon: "🧩", title: "Un puzzle à reconstituer", text: "Fais glisser les fragments de lune en touchant une case voisine du vide.", kind: "puzzle" },
    { at: 10, icon: "🎁", title: "Un cadeau numérique", text: "Crée une illustration de lune à télécharger comme fond d’écran.", kind: "wallpaper" },
    { at: 12, icon: "🎞️", title: "Le montage souvenir", text: "Parcours une petite séquence de démonstration. Les vrais souvenirs seront ajoutés plus tard.", kind: "montage" },
    { at: 15, icon: "✨", title: "Le dernier fragment", text: "La lune est complète. La dernière révélation t’attend.", kind: "final" }
  ];

  const fragmentAt = new Set([1, 3, 5, 7, 9, 11, 14]);
  const hints = [
    "Pense au mois où notre histoire a commencé…",
    "C’est à la fin du mois d’août 🌙",
    "Le jour exact est le 25. Format : 25/08."
  ];
  let progress = readProgress();
  let index = progress.index;
  let fragments = progress.fragments;
  let wrong = 0;
  let answerLocked = false;
  let lastReward = null;
  let introTimer = null;
  let audioContext = null;
  let audioTimer = null;
  let currentVideoUrl = null;
  let photoUrls = [];
  let puzzleTiles = [];
  let puzzleMoves = 0;
  let montageIndex = 0;

  function readProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return {
        index: Number.isInteger(parsed.index) ? Math.max(0, Math.min(questions.length, parsed.index)) : 0,
        fragments: Number.isInteger(parsed.fragments) ? Math.max(0, Math.min(7, parsed.fragments)) : 0
      };
    } catch {
      return { index: 0, fragments: 0 };
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ index, fragments }));
    } catch {
      // Progress remains playable if local storage is unavailable.
    }
  }

  function show(id) {
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
    const next = $(id);
    if (!next) return;
    next.classList.add("active");
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function startIntro() {
    window.clearInterval(introTimer);
    const phrase = "ya hayti… t’es pas prête pour ce qui arrive. 😏\nJ’espère que tu connais vraiment ton homme…\nmontre-moi que t’es bien ma femme. 💍";
    const text = $("introText");
    const button = $("startBtn");
    text.textContent = "";
    button.hidden = true;
    if (testMode || reducedMotion) {
      text.textContent = phrase;
      button.hidden = false;
      return;
    }
    let char = 0;
    introTimer = window.setInterval(() => {
      char += 1;
      text.textContent = phrase.slice(0, char);
      if (char >= phrase.length) {
        window.clearInterval(introTimer);
        button.hidden = false;
      }
    }, 34);
  }

  function renderFragments() {
    const container = $("fragments");
    container.replaceChildren();
    for (let i = 0; i < 7; i += 1) {
      const item = document.createElement("span");
      item.className = "fragment" + (i < fragments ? " filled" : "");
      item.textContent = i < fragments ? "✦" : "·";
      item.setAttribute("aria-label", i < fragments ? "Fragment obtenu" : "Fragment à obtenir");
      container.appendChild(item);
    }
    $("moonCount").textContent = "Fragments : " + fragments + " / 7";
  }

  function renderQuestion() {
    if (index >= questions.length) {
      show("final");
      return;
    }
    answerLocked = false;
    const q = questions[index];
    $("stepLabel").textContent = "ÉPREUVE " + String(index + 1).padStart(2, "0") + " / " + questions.length;
    $("bar").style.width = (index / questions.length * 100) + "%";
    $("bar").parentElement.setAttribute("aria-valuenow", String(Math.round(index / questions.length * 100)));
    $("questionType").textContent = q.type;
    $("questionTitle").textContent = q.title;
    $("questionText").textContent = q.text;
    $("quizFeedback").textContent = "";
    const answers = $("answers");
    answers.replaceChildren();
    q.answers.forEach((answerText, answerIndex) => {
      const button = document.createElement("button");
      button.className = "answer";
      button.type = "button";
      button.textContent = answerText;
      button.addEventListener("click", () => answerQuestion(answerIndex), { once: true });
      answers.appendChild(button);
    });
    renderFragments();
  }

  function checkDate() {
    const raw = $("dateInput").value.trim().replace(/[.\- ]/g, "/");
    const digits = raw.replace(/\D/g, "");
    let value = raw;
    if (digits.length === 4) value = digits.slice(0, 2) + "/" + digits.slice(2);
    if (digits.length === 8) value = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    if (["25/08", "25/8", "25/08/2026", "25/8/2026"].includes(value)) {
      $("dateHint").textContent = "";
      if (index >= questions.length) show("final");
      else {
        show("quiz");
        renderQuestion();
      }
      return;
    }
    wrong += 1;
    $("dateHint").textContent = hints[Math.min(wrong - 1, hints.length - 1)];
  }

  function answerQuestion(choice) {
    if (answerLocked || index >= questions.length) return;
    answerLocked = true;
    const q = questions[index];
    $("answers").querySelectorAll("button").forEach((button) => { button.disabled = true; });
    if (choice === q.correct) {
      $("quizFeedback").textContent = q.feedback;
      if (fragmentAt.has(index) && fragments < 7) fragments += 1;
      renderFragments();
    } else {
      $("quizFeedback").textContent = "Pas tout à fait 😏 mais tu peux continuer. Une mauvaise réponse ne t’empêchera jamais de découvrir les surprises.";
    }
    window.setTimeout(afterAnswer, choice === q.correct ? 700 : 950);
  }

  function afterAnswer() {
    index = Math.min(questions.length, index + 1);
    saveProgress();
    const reward = rewards.find((item) => item.at === index);
    if (reward) openReward(reward);
    else if (index >= questions.length) show("final");
    else renderQuestion();
  }

  function openReward(reward) {
    lastReward = reward;
    $("rewardIcon").textContent = reward.icon;
    $("rewardTitle").textContent = reward.title;
    $("rewardText").textContent = reward.text;
    const extra = $("rewardExtra");
    extra.replaceChildren();
    if (reward.kind === "photo") renderPhotoFeature(extra);
    if (reward.kind === "letters") renderLettersFeature(extra);
    if (reward.kind === "puzzle") renderPuzzleFeature(extra);
    if (reward.kind === "wallpaper") renderWallpaperFeature(extra);
    if (reward.kind === "montage") renderMontageFeature(extra);
    $("rewardNext").textContent = reward.kind === "final" ? "Découvrir la révélation" : "Continuer la quête";
    show("reward");
  }

  function renderPhotoFeature(container) {
    container.innerHTML = '<label class="upload-label" for="photoInput">Choisir des photos sur cet appareil</label><input class="file-input" id="photoInput" type="file" accept="image/*" multiple><p class="small">Aperçu local uniquement : les photos ne sont ni envoyées ni enregistrées.</p><div class="photo-preview" id="photoPreview"></div>';
    $("photoInput").addEventListener("change", (event) => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
      photoUrls = [];
      const preview = $("photoPreview");
      preview.replaceChildren();
      const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/")).slice(0, 8);
      files.forEach((file, fileIndex) => {
        const url = URL.createObjectURL(file);
        photoUrls.push(url);
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = url;
        image.alt = "Aperçu local de la photo " + (fileIndex + 1);
        const caption = document.createElement("figcaption");
        caption.textContent = file.name;
        figure.append(image, caption);
        preview.appendChild(figure);
      });
      if (event.target.files && event.target.files.length > files.length) {
        $("rewardText").textContent = "Aperçu des " + files.length + " premières images. " + (event.target.files.length - files.length) + " fichier(s) ignoré(s).";
      }
    });
  }

  function renderLettersFeature(container) {
    const letters = [
      ["💌 Quand tu souris", "J’espère que cette petite quête t’a donné le sourire. Même à distance, tes moments de joie comptent beaucoup pour moi."],
      ["🌙 Quand tu me manques", "La distance peut séparer les chemins, mais elle n’efface pas les pensées ni les attentions."],
      ["❤️ Quand tu as besoin d’amour", "Rappelle-toi que tu comptes pour moi. Prends le temps de respirer : je suis avec toi par la pensée."],
      ["😏 Pour rire un peu", "Tu as réussi la quête… maintenant tu peux officiellement te vanter d’avoir gagné contre la lune."]
    ];
    const list = document.createElement("div");
    list.className = "letter-list";
    letters.forEach((letter, letterIndex) => {
      const button = document.createElement("button");
      button.className = "letter-button";
      button.type = "button";
      button.textContent = letter[0];
      button.setAttribute("aria-expanded", "false");
      const message = document.createElement("p");
      message.className = "letter-message";
      message.textContent = letter[1];
      message.hidden = true;
      button.addEventListener("click", () => {
        const open = !message.hidden;
        message.hidden = open;
        button.setAttribute("aria-expanded", String(!open));
      });
      list.append(button, message);
    });
    container.appendChild(list);
  }

  const puzzleSymbols = ["", "🌙", "♡", "✦", "💍", "✨", "🌹", "☾", "★"];

  function shufflePuzzle() {
    puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let blank = 8;
    let previousBlank = -1;
    for (let step = 0; step < 70; step += 1) {
      const candidates = [];
      if (blank % 3 > 0) candidates.push(blank - 1);
      if (blank % 3 < 2) candidates.push(blank + 1);
      if (blank > 2) candidates.push(blank - 3);
      if (blank < 6) candidates.push(blank + 3);
      const valid = candidates.filter((item) => item !== previousBlank);
      const next = valid[Math.floor(Math.random() * valid.length)];
      puzzleTiles[blank] = puzzleTiles[next];
      puzzleTiles[next] = 0;
      previousBlank = blank;
      blank = next;
    }
    puzzleMoves = 0;
    drawPuzzle();
  }

  function drawPuzzle() {
    const board = $("puzzleBoard");
    if (!board) return;
    board.replaceChildren();
    puzzleTiles.forEach((tile, position) => {
      if (tile === 0) {
        const empty = document.createElement("div");
        empty.className = "puzzle-empty";
        empty.textContent = "✧";
        empty.setAttribute("aria-label", "Case vide");
        board.appendChild(empty);
        return;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "puzzle-tile";
      button.innerHTML = puzzleSymbols[tile] + "<span>" + tile + "</span>";
      button.setAttribute("aria-label", "Déplacer la pièce " + tile);
      button.addEventListener("click", () => movePuzzleTile(position));
      board.appendChild(button);
    });
    const message = $("puzzleMessage");
    if (message) message.textContent = isPuzzleSolved() ? "Bravo ! La lune est reconstituée en " + puzzleMoves + " mouvements. ✨" : "Mouvements : " + puzzleMoves;
  }

  function movePuzzleTile(position) {
    const blank = puzzleTiles.indexOf(0);
    const isAdjacent = Math.abs(Math.floor(position / 3) - Math.floor(blank / 3)) + Math.abs((position % 3) - (blank % 3)) === 1;
    if (!isAdjacent) return;
    puzzleTiles[blank] = puzzleTiles[position];
    puzzleTiles[position] = 0;
    puzzleMoves += 1;
    drawPuzzle();
  }

  function isPuzzleSolved() {
    return puzzleTiles.every((tile, position) => tile === (position === 8 ? 0 : position + 1));
  }

  function renderPuzzleFeature(container) {
    container.innerHTML = '<p class="small">Le plateau est mélangé à chaque ouverture. Touche une case voisine du vide pour la déplacer.</p><div class="puzzle-board" id="puzzleBoard" aria-label="Puzzle de la lune"></div><p class="feedback" id="puzzleMessage" aria-live="polite"></p><button class="ghost" id="puzzleReset" type="button">Mélanger à nouveau</button>';
    $("puzzleReset").addEventListener("click", shufflePuzzle);
    shufflePuzzle();
  }

  function renderWallpaperFeature(container) {
    container.innerHTML = '<div class="demo-card" aria-hidden="true">🌙 ✦ 💍</div><p class="small">Illustration de démonstration créée dans le navigateur, sans photo personnelle.</p><button class="ghost" id="downloadWallpaper" type="button">Télécharger le fond d’écran</button>';
    $("downloadWallpaper").addEventListener("click", downloadWallpaper);
  }

  function downloadWallpaper() {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="#351321"/><stop offset="1" stop-color="#08060a"/></linearGradient><radialGradient id="moon"><stop stop-color="#fff7d7"/><stop offset=".55" stop-color="#e8c77a"/><stop offset="1" stop-color="#966634"/></radialGradient></defs><rect width="1080" height="1920" fill="url(#bg)"/><circle cx="540" cy="810" r="220" fill="url(#moon)"/><circle cx="650" cy="745" r="205" fill="#160d17"/><circle cx="540" cy="810" r="290" fill="none" stroke="#e8c77a" stroke-opacity=".55"/><text x="540" y="1260" text-anchor="middle" fill="#e8c77a" font-family="Georgia,serif" font-size="64">LOVE QUEST</text><text x="540" y="1340" text-anchor="middle" fill="#fff7f0" font-family="Georgia,serif" font-size="44">月の輝き  ✦  💍</text></svg>';
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "love-quest-wallpaper.svg";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const montageSlides = [
    ["🌙", "Un premier souvenir", "Chaque aventure commence par une petite lumière."],
    ["💌", "Un mot à garder", "Les attentions du quotidien ont aussi leur place dans l’histoire."],
    ["✨", "La suite à écrire", "Les vraies photos et la vidéo pourront remplacer ces cartes de démonstration."]
  ];

  function renderMontageFeature(container) {
    montageIndex = 0;
    container.innerHTML = '<div id="montageCard" class="demo-card" aria-live="polite"></div><h3 id="montageTitle"></h3><p id="montageCaption" class="demo-caption"></p><button class="ghost" id="montageNext" type="button">Souvenir suivant</button><p class="small">Séquence de démonstration : aucun souvenir personnel n’est inclus.</p>';
    drawMontage();
    $("montageNext").addEventListener("click", () => {
      montageIndex = (montageIndex + 1) % montageSlides.length;
      drawMontage();
    });
  }

  function drawMontage() {
    const slide = montageSlides[montageIndex];
    $("montageCard").textContent = slide[0];
    $("montageTitle").textContent = slide[1];
    $("montageCaption").textContent = slide[2];
    $("montageNext").textContent = montageIndex === montageSlides.length - 1 ? "Revoir le début" : "Souvenir suivant";
  }

  $("startBtn").addEventListener("click", () => show("gate"));
  $("dateBtn").addEventListener("click", checkDate);
  $("dateInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") checkDate();
  });
  $("rewardNext").addEventListener("click", () => {
    if (lastReward && lastReward.kind === "final") {
      show("final");
      $("bar").style.width = "100%";
      $("bar").parentElement.setAttribute("aria-valuenow", "100");
    } else {
      show("quiz");
      renderQuestion();
    }
  });

  $("finalVideoInput").addEventListener("change", (event) => {
    const file = (event.target.files || [])[0];
    if (!file) return;
    if (currentVideoUrl) URL.revokeObjectURL(currentVideoUrl);
    currentVideoUrl = URL.createObjectURL(file);
    $("finalVideo").src = currentVideoUrl;
    $("finalVideo").hidden = false;
    $("videoStatus").textContent = "Aperçu local prêt : " + file.name + ". La vidéo reste sur cet appareil.";
  });

  function playChime() {
    if (!audioContext || audioContext.state !== "running") return;
    [261.63, 329.63, 392].forEach((frequency, noteIndex) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + noteIndex * 0.18;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.025, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.58);
    });
  }

  $("soundToggle").addEventListener("click", async () => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      $("soundToggle").textContent = "Ambiance sonore non disponible";
      $("soundToggle").disabled = true;
      return;
    }
    if (audioTimer) {
      window.clearInterval(audioTimer);
      audioTimer = null;
      if (audioContext && audioContext.state === "running") await audioContext.suspend();
      $("soundToggle").textContent = "Activer l’ambiance sonore";
      $("soundToggle").setAttribute("aria-pressed", "false");
      return;
    }
    try {
      audioContext = audioContext || new AudioCtor();
      await audioContext.resume();
      playChime();
      audioTimer = window.setInterval(playChime, 7000);
      $("soundToggle").textContent = "Désactiver l’ambiance sonore";
      $("soundToggle").setAttribute("aria-pressed", "true");
    } catch {
      $("soundToggle").textContent = "Ambiance sonore indisponible";
    }
  });

  if (testMode) {
    $("testPanel").hidden = false;
    $("testNext").addEventListener("click", () => {
      if (!$("quiz").classList.contains("active")) {
        if (index >= questions.length) index = 0;
        show("quiz");
        renderQuestion();
        return;
      }
      if (index < questions.length && fragmentAt.has(index) && fragments < 7) fragments += 1;
      index = Math.min(questions.length, index + 1);
      saveProgress();
      const reward = rewards.find((item) => item.at === index);
      if (reward) openReward(reward);
      else if (index >= questions.length) show("final");
      else renderQuestion();
    });
    $("testReward").addEventListener("click", () => openReward(rewards[Math.floor(Math.random() * rewards.length)]));
    $("testFinal").addEventListener("click", () => show("final"));
    $("testReset").addEventListener("click", () => {
      index = 0;
      fragments = 0;
      wrong = 0;
      saveProgress();
      $("dateInput").value = "";
      $("dateHint").textContent = "";
      show("intro");
      startIntro();
    });
  }

  for (let i = 0; i < 75; i += 1) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.left = (Math.random() * 100) + "%";
    star.style.top = (Math.random() * 100) + "%";
    star.style.animationDelay = (Math.random() * 4) + "s";
    star.style.opacity = String(0.15 + Math.random() * 0.6);
    $("stars").appendChild(star);
  }

  startIntro();
  renderFragments();
})();
