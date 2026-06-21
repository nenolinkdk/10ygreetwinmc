(() => {
  "use strict";

  const totalQuestions = 10;
  const scoreEl = document.getElementById("score");
  const progressEl = document.getElementById("progress");
  const startScreen = document.getElementById("startScreen");
  const quizScreen = document.getElementById("quizScreen");
  const finalScreen = document.getElementById("finalScreen");
  const questionLabel = document.getElementById("questionLabel");
  const questionText = document.getElementById("questionText");
  const answersEl = document.getElementById("answers");
  const feedbackEl = document.getElementById("feedback");
  const finalScore = document.getElementById("finalScore");
  const finalCake = document.getElementById("finalCake");
  const scoreStack = document.getElementById("scoreStack");
  const startBtn = document.getElementById("startBtn");
  const againBtn = document.getElementById("againBtn");

  let score = 0;
  let questionNumber = 0;
  let currentQuestion = null;
  let operationDeck = [];
  let answerLocked = false;
  const scoreMaterials = ["sand", "dirt", "grass", "wood", "stone", "coal", "iron", "gold", "emerald", "diamond"];

  function showScreen(screen) {
    [startScreen, quizScreen, finalScreen].forEach((item) => item.classList.remove("active"));
    screen.classList.add("active");
  }

  function startGame() {
    score = 0;
    questionNumber = 0;
    operationDeck = shuffle(["add", "add", "add", "sub", "sub", "sub", "mul", "mul", "mul", "div"]);
    feedbackEl.innerHTML = steveSvg();
    feedbackEl.className = "feedback good";
    updateScore();
    nextQuestion();
  }

  function updateScore() {
    scoreEl.textContent = String(score);
    progressEl.textContent = `${Math.min(questionNumber, totalQuestions)}/${totalQuestions}`;
    scoreStack.replaceChildren();

    for (let index = 0; index < score / 10; index += 1) {
      const block = document.createElement("span");
      block.className = `score-block ${scoreMaterials[Math.min(index, scoreMaterials.length - 1)]}`;
      scoreStack.append(block);
    }
  }

  function nextQuestion() {
    if (questionNumber === totalQuestions) {
      showFinal();
      return;
    }

    questionNumber += 1;
    currentQuestion = makeQuestion();
    answerLocked = false;
    questionLabel.textContent = `Mission ${questionNumber} af ${totalQuestions}`;
    questionText.textContent = currentQuestion.text;
    answersEl.replaceChildren();

    currentQuestion.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(choice);
      button.addEventListener("click", () => chooseAnswer(choice));
      answersEl.append(button);
    });

    updateScore();
    showScreen(quizScreen);
  }

  function chooseAnswer(answer) {
    if (answerLocked) return;
    answerLocked = true;
    const isCorrect = answer === currentQuestion.answer;

    if (isCorrect) score += 10;

    updateScore();
    showFeedback(isCorrect);
    setTimeout(nextQuestion, 780);
  }

  function showFinal() {
    finalScore.textContent = `Du fik ${score} point ud af ${totalQuestions * 10}.`;
    finalCake.innerHTML = cakeSvg();
    progressEl.textContent = `${totalQuestions}/${totalQuestions}`;
    showScreen(finalScreen);
  }

  function makeQuestion() {
    const type = operationDeck[questionNumber - 1] || "add";
    if (type === "add") return additionQuestion();
    if (type === "sub") return subtractionQuestion();
    if (type === "mul") return multiplicationQuestion();
    return divisionQuestion();
  }

  function additionQuestion() {
    const a = randomInt(8, 50);
    const b = randomInt(5, 48);
    return makeChoices(`Hvad er ${a} + ${b}?`, a + b);
  }

  function subtractionQuestion() {
    const answer = randomInt(5, 54);
    const b = randomInt(4, 45);
    return makeChoices(`Hvad er ${answer + b} - ${b}?`, answer);
  }

  function multiplicationQuestion() {
    const a = randomInt(2, 10);
    const b = randomInt(2, 10);
    return makeChoices(`Hvad er ${a} x ${b}?`, a * b);
  }

  function divisionQuestion() {
    const answer = randomInt(2, 10);
    const divisor = randomInt(2, 9);
    return makeChoices(`Hvad er ${answer * divisor} / ${divisor}?`, answer);
  }

  function makeChoices(text, answer) {
    const choices = new Set([answer]);
    while (choices.size < 3) choices.add(Math.max(1, answer + randomInt(-10, 10)));
    return { text, answer, choices: shuffle([...choices]) };
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index);
      [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
    }
    return items;
  }

  function showFeedback(isCorrect) {
    feedbackEl.className = `feedback ${isCorrect ? "good" : "bad"}`;
    feedbackEl.innerHTML = isCorrect ? steveSvg() : randomMobSvg();
  }

  function randomMobSvg() {
    return [creeperSvg, zombieSvg, skeletonSvg][randomInt(0, 2)]();
  }

  function steveSvg() {
    return `<svg viewBox="0 0 96 96" role="img" aria-label="Rigtigt svar"><rect x="22" y="10" width="52" height="38" fill="#c8875f" stroke="#1f2430" stroke-width="4"/><rect x="22" y="48" width="52" height="28" fill="#31a7c9" stroke="#1f2430" stroke-width="4"/><rect x="16" y="52" width="14" height="30" fill="#c8875f" stroke="#1f2430" stroke-width="4"/><rect x="66" y="52" width="14" height="30" fill="#c8875f" stroke="#1f2430" stroke-width="4"/><rect x="30" y="76" width="16" height="16" fill="#293d99" stroke="#1f2430" stroke-width="4"/><rect x="50" y="76" width="16" height="16" fill="#293d99" stroke="#1f2430" stroke-width="4"/><rect x="26" y="8" width="44" height="12" fill="#4a2a18"/><rect x="34" y="28" width="8" height="8" fill="#1f2430"/><rect x="54" y="28" width="8" height="8" fill="#1f2430"/><rect x="40" y="38" width="16" height="5" fill="#7a3f2c"/></svg>`;
  }

  function creeperSvg() {
    return `<svg viewBox="0 0 96 96" role="img" aria-label="Creeper"><rect x="20" y="10" width="56" height="56" fill="#65c957" stroke="#1f2430" stroke-width="4"/><rect x="30" y="24" width="12" height="14" fill="#1f2430"/><rect x="54" y="24" width="12" height="14" fill="#1f2430"/><rect x="42" y="40" width="12" height="12" fill="#1f2430"/><rect x="34" y="52" width="28" height="12" fill="#1f2430"/><rect x="26" y="66" width="16" height="22" fill="#55aa45" stroke="#1f2430" stroke-width="4"/><rect x="54" y="66" width="16" height="22" fill="#55aa45" stroke="#1f2430" stroke-width="4"/></svg>`;
  }

  function zombieSvg() {
    return `<svg viewBox="0 0 96 96" role="img" aria-label="Zombie"><rect x="22" y="10" width="52" height="38" fill="#72a86a" stroke="#1f2430" stroke-width="4"/><rect x="22" y="48" width="52" height="28" fill="#4e72bd" stroke="#1f2430" stroke-width="4"/><rect x="14" y="52" width="16" height="30" fill="#72a86a" stroke="#1f2430" stroke-width="4"/><rect x="66" y="52" width="16" height="30" fill="#72a86a" stroke="#1f2430" stroke-width="4"/><rect x="30" y="76" width="16" height="16" fill="#3c4c8e" stroke="#1f2430" stroke-width="4"/><rect x="50" y="76" width="16" height="16" fill="#3c4c8e" stroke="#1f2430" stroke-width="4"/><rect x="34" y="27" width="8" height="8" fill="#1f2430"/><rect x="54" y="27" width="8" height="8" fill="#1f2430"/><rect x="40" y="40" width="18" height="5" fill="#274c2a"/></svg>`;
  }

  function skeletonSvg() {
    return `<svg viewBox="0 0 96 96" role="img" aria-label="Skelet"><rect x="22" y="10" width="52" height="38" fill="#e6e1d5" stroke="#1f2430" stroke-width="4"/><rect x="30" y="24" width="10" height="12" fill="#1f2430"/><rect x="56" y="24" width="10" height="12" fill="#1f2430"/><rect x="42" y="38" width="12" height="7" fill="#1f2430"/><rect x="28" y="48" width="40" height="30" fill="#d8d0c3" stroke="#1f2430" stroke-width="4"/><rect x="16" y="52" width="12" height="34" fill="#e6e1d5" stroke="#1f2430" stroke-width="4"/><rect x="68" y="52" width="12" height="34" fill="#e6e1d5" stroke="#1f2430" stroke-width="4"/><rect x="32" y="78" width="12" height="14" fill="#e6e1d5" stroke="#1f2430" stroke-width="4"/><rect x="52" y="78" width="12" height="14" fill="#e6e1d5" stroke="#1f2430" stroke-width="4"/></svg>`;
  }

  function cakeSvg() {
    return `<svg viewBox="0 0 260 210" role="img" aria-label="Fødselsdagskage"><rect x="54" y="92" width="152" height="26" fill="#ffe08a" stroke="#1f2430" stroke-width="6"/><rect x="36" y="116" width="188" height="56" fill="#d78354" stroke="#1f2430" stroke-width="6"/><rect x="36" y="116" width="188" height="18" fill="#fff4c2" stroke="#1f2430" stroke-width="6"/><rect x="56" y="134" width="22" height="16" fill="#ff6b6b"/><rect x="104" y="134" width="22" height="16" fill="#7b2cbf"/><rect x="152" y="134" width="22" height="16" fill="#4d96ff"/><rect x="196" y="134" width="22" height="16" fill="#00a676"/><rect x="82" y="52" width="12" height="40" fill="#4d96ff" stroke="#1f2430" stroke-width="4"/><rect x="124" y="42" width="12" height="50" fill="#ff6b6b" stroke="#1f2430" stroke-width="4"/><rect x="166" y="52" width="12" height="40" fill="#00a676" stroke="#1f2430" stroke-width="4"/><path class="flame" d="M88 24 C104 44 92 52 88 58 C82 50 70 42 88 24 Z" fill="#ffb703" stroke="#1f2430" stroke-width="3"/><path class="flame" d="M130 14 C148 38 136 48 130 58 C124 48 112 38 130 14 Z" fill="#ffb703" stroke="#1f2430" stroke-width="3"/><path class="flame" d="M172 24 C188 44 176 52 172 58 C166 50 154 42 172 24 Z" fill="#ffb703" stroke="#1f2430" stroke-width="3"/><rect x="22" y="172" width="216" height="18" fill="#858b90" stroke="#1f2430" stroke-width="6"/></svg>`;
  }

  startBtn.addEventListener("click", startGame);
  againBtn.addEventListener("click", startGame);
  updateScore();
})();
