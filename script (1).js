/* ========================= */
/* LETTERS */
/* ========================= */

const spanishLetterFrequencies = [
  { letter: "A", weight: 1744 },
  { letter: "E", weight: 1151 },
  { letter: "R", weight: 755 },
  { letter: "S", weight: 854 },
  { letter: "O", weight: 825 },
  { letter: "I", weight: 679 },
  { letter: "N", weight: 622 },
  { letter: "C", weight: 434 },
  { letter: "L", weight: 398 },
  { letter: "T", weight: 391 },
  { letter: "D", weight: 370 },
  { letter: "U", weight: 319 },
  { letter: "M", weight: 285 },
  { letter: "B", weight: 235 },
  { letter: "P", weight: 228 },
  { letter: "G", weight: 163 },
  { letter: "H", weight: 113 },
  { letter: "F", weight: 99 },
  { letter: "V", weight: 95 },
  { letter: "J", weight: 87 },
  { letter: "Z", weight: 80 },
  { letter: "Q", weight: 33 },
  { letter: "Y", weight: 24 },
  { letter: "X", weight: 16 }
];

const spanishVowelFrequencies = spanishLetterFrequencies
.filter(({ letter }) => ["A","E","I","O","U"].includes(letter));

/* ========================= */
/* ELEMENTS */
/* ========================= */

const lettersDiv =
document.getElementById("letters");

const wordSlots =
document.getElementById("wordSlots");

const scoreText =
document.getElementById("score");

const timeText =
document.getElementById("time");

const message =
document.getElementById("message");

const submitButton =
document.querySelector(".submitBtn");

/* ========================= */
/* STATE */
/* ========================= */

let currentLetters = [];

let currentWord = "";

let score = 0;

let time = 90;

let timer = null;

let gameOver = false;

let wordHistory = [];

function saveTimeOverWord(word){

  wordHistory.push({
    word: word,
    type: "timeout"
  });

  console.log("PALABRA AL TERMINAR:", word);
}


/* ========================= */
/* DICTIONARY */
/* ========================= */

let dictionary = [];

let dictionaryReady = false;

fetch("words-es.txt")
.then(r => r.text())
.then(text => {

  dictionary = text
  .split("\n")
  .map(w => w.trim().toUpperCase());

  dictionaryReady = true;

  if(submitButton){

    submitButton.disabled = false;
  }

  if(!gameOver && message.innerText === "CARGANDO PALABRAS..."){

    message.innerHTML = "";
  }

})
.catch(() => {

  message.innerHTML = "NO SE PUDO CARGAR LA LISTA DE PALABRAS";

});

/* ========================= */
/* GENERATE LETTERS */
/* ========================= */

function generateLetters(){

  currentLetters = [];

  const vowels = ["A","E","I","O","U"];

const consonants = spanishLetterFrequencies
.filter(({ letter }) =>
  !vowels.includes(letter)
);

function generateLetters(){

  currentLetters = [];

  // 3 vocales obligatorias
  for(let i = 0; i < 3; i++){

    currentLetters.push(
      pickWeightedLetter(spanishVowelFrequencies)
    );
  }

  // 3 consonantes obligatorias
  for(let i = 0; i < 3; i++){

    currentLetters.push(
      pickWeightedLetter(consonants)
    );
  }

  // 3 letras libres
  for(let i = 0; i < 3; i++){

    currentLetters.push(
      pickWeightedLetter(spanishLetterFrequencies)
    );
  }

  // Si hay Q y no hay U, reemplazar una letra por U
  if(
    currentLetters.includes("Q") &&
    !currentLetters.includes("U")
  ){

    let idx;

    do{

      idx = Math.floor(
        Math.random() * currentLetters.length
      );

    }while(currentLetters[idx] === "Q");

    currentLetters[idx] = "U";
  }

  shuffleArray(currentLetters);

  renderLetters();

  renderSlots();
}

function pickWeightedLetter(frequencies){

  const totalWeight = frequencies.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  let randomWeight = Math.random() * totalWeight;

  for(const item of frequencies){

    randomWeight -= item.weight;

    if(randomWeight <= 0){

      return item.letter;
    }
  }

  return frequencies[frequencies.length - 1].letter;
}

/* ========================= */
/* SHUFFLE */
/* ========================= */

function shuffleArray(arr){

  for(

    let i = arr.length - 1;
    i > 0;
    i--

  ){

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] =
    [arr[j], arr[i]];
  }
}

/* ========================= */
/* CLEAR WORD */
/* ========================= */

function clearWord() {

  if (gameOver) return;

  currentWord = "";

  const btns =
    document.querySelectorAll(".letterBtn");

  btns.forEach(btn => {

    btn.disabled = false;

    btn.style.opacity = 1;
  });

  renderSlots();
}

/* ========================= */
/* RENDER LETTERS */
/* ========================= */

function renderLetters(){

  lettersDiv.innerHTML = "";

  currentLetters.forEach(
    (letter,index)=>{

      const btn =
      document.createElement("button");

      btn.className =
      "letterBtn";

      btn.innerText =
      letter;

      btn.onclick =
      ()=>selectLetter(index);

      lettersDiv.appendChild(btn);
    }
  );
}

/* ========================= */
/* RENDER SLOTS */
/* ========================= */

function renderSlots(){

  wordSlots.innerHTML = "";

  for(let i=0;i<9;i++){

    const slot =
    document.createElement("div");

    slot.className =
    "slot";

    slot.innerText =
    currentWord[i] || "";

    wordSlots.appendChild(slot);
  }
}

/* ========================= */
/* SELECT LETTER */
/* ========================= */

function selectLetter(index){

  if(gameOver) return;

  const btns =
  document.querySelectorAll(".letterBtn");

  const btn =
  btns[index];

  if(btn.disabled) return;

  currentWord +=
  currentLetters[index];

  btn.disabled = true;

  btn.style.opacity = 0.3;

  renderSlots();
}

/* ========================= */
/* DELETE LETTER */
/* ========================= */

function deleteLetter(){

  if(gameOver) return;

  if(currentWord.length === 0)
  return;

  const last =
  currentWord[
    currentWord.length - 1
  ];

  currentWord =
  currentWord.slice(0,-1);

  const btns =
  document.querySelectorAll(".letterBtn");

  for(

    let i = btns.length - 1;
    i >= 0;
    i--

  ){

    if(

      currentLetters[i] === last &&
      btns[i].disabled

    ){

      btns[i].disabled = false;

      btns[i].style.opacity = 1;

      break;
    }
  }

  renderSlots();
}

/* ========================= */
/* SHUFFLE BUTTON */
/* ========================= */

function shuffleLetters(){

  if(gameOver) return;

  shuffleArray(currentLetters);

  renderLetters();
}

/* ========================= */
/* CAN BUILD */
/* ========================= */

function canBuildWord(word){

  let temp = [...currentLetters];

  for(let letter of word){

    const idx =
    temp.indexOf(letter);

    if(idx === -1)
    return false;

    temp.splice(idx,1);
  }

  return true;
}

/* ========================= */
/* VALID WORD */
/* ========================= */

function isValidWord(word){

  return dictionary.includes(word);
}

/* ========================= */
/* FIND BEST WORD */
/* ========================= */

function findBestWord(){

  let best = "";

  dictionary.forEach(word=>{

    if(

      word.length <= 9 &&
      canBuildWord(word) &&
      word.length > best.length

    ){

      best = word;
    }
  });

  return best;
}

/* ========================= */
/* GET LONGEST WORDS */
/* ========================= */

function getLongestWords(bestWord){

  return [

    ...new Set(

      dictionary.filter(w =>

        w.length === bestWord.length &&
        w.length <= 9 &&
        canBuildWord(w)

      )

    )

  ].slice(0,3);
}

/* ========================= */
/* TIMER */
/* ========================= */


function startTimer(){

  clearInterval(timer);
  gameOver = false;

  timer = setInterval(()=>{

    if(gameOver) return;

    time--;
    timeText.innerText = time;

    if(time <= 0){

      time = 0;
      timeText.innerText = 0;

      clearInterval(timer);
      gameOver = true;

      const word = currentWord.trim().toUpperCase();

      if(word.length < 3){
        message.innerHTML = "❌ MIN 3 LETRAS";
        currentWord = "";
        renderSlots();
        return;
      }

      saveTimeOverWord(word);

      const bestWord = findBestWord();
      const longestWords = getLongestWords(bestWord);

      let letterPoints = word.length * 10;

      message.innerHTML =
        "<span style='color:#f4d35e;font-size:22px'>" +
        word +
        "</span><br>" +
        "⭐ " + letterPoints + " PUNTOS<br><br>" +
        "🏆 PALABRA MÁS LARGA (" +
        bestWord.length +
        ")<br>" +
        "<span style='color:#fff7d6'>" +
        longestWords.join(" • ") +
        "</span>";

      currentWord = "";
      renderSlots();
    }

  }, 1000);
}

/* ========================= */
/* SUBMIT */
/* ========================= */

function submitWord(){

  if(gameOver) return;

  if(!dictionaryReady){

    message.innerHTML =
    "CARGANDO PALABRAS...";

    return;
  }

  clearInterval(timer);

  const word =
  currentWord.toUpperCase();

  if(word.length < 3){

    message.innerHTML =
    "❌ MIN 3 LETRAS";

    startTimer();

    return;
  }

  if(!canBuildWord(word)){

    message.innerHTML =
    "❌ LETRAS NO VÁLIDAS";

    startTimer();

    return;
  }

  if(!isValidWord(word)){

    message.innerHTML =
    "❌ NO VÁLIDA";

    startTimer();

    return;
  }

  const bestWord =
  findBestWord();

  const longestWords =
  getLongestWords(bestWord);

  let letterPoints =
  word.length * 10;

  let timeBonus =
  Math.floor(time / 10) - 4;

  if(timeBonus < 0){

    timeBonus = 0;
  }

  let longWordBonus = 0;

  let allLettersBonus = 0;

  if(word.length === 9){

    allLettersBonus = 100;
  }

  if(
    word.length ===
    bestWord.length
  ){

    longWordBonus = 100;
  }

  let points =

    letterPoints +
    timeBonus +
    longWordBonus +
    allLettersBonus;

  score += points;

  scoreText.innerText =
  score;

  message.innerHTML =

    "<span style='color:#f4d35e;font-size:26px'>" +

    word +

    "</span>" +
    "✅ " +
    letterPoints +

    " PUNTOS  ";

  if(timeBonus > 0){

    message.innerHTML +=

      "⏳ BONO +" +

      timeBonus;
  }

  if(longWordBonus > 0){

    message.innerHTML +=

      "<br>👑 BONO PALABRA MÁS LARGA +100";
  }

  if(allLettersBonus > 0){

    message.innerHTML +=

      "🔥 9 LETRAS +100";
  }

  message.innerHTML +=

    "  TOTAL: " +

    points +

    "<br>" +
    "<span style='color:#fff7d6'>" +
    "MÁS LARGA (" +

    bestWord.length +

    ") " +

   "</span>"+

    longestWords.join(" • ") 

 ;

  currentWord = "";

  renderSlots();

  gameOver = true;
}

/* ========================= */
/* RESTART */
/* ========================= */

function restartGame(){

  clearInterval(timer);

  currentWord = "";

  time = 90;

  timeText.innerText = time;

  gameOver = false;

  message.innerHTML = "";

  generateLetters();

  startTimer();
}

/* ========================= */
/* START */
/* ========================= */

generateLetters();

startTimer();
