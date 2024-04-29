const jogo = document.getElementById("jogo");
const pontuacao = document.getElementById("pontuacao");
const tempo = document.getElementById("tempo");
const botaoNovoJogo = document.getElementById("botao-novo-jogo");
const BackMenu = document.getElementById("back-menu");

let score = 0;
let remainingTime = 30;
let intervalo;

function iniciarJogo() {
  score = 0;
  remainingTime = 30;
  pontuacao.textContent = `Pontuação: ${score}`;
  tempo.textContent = `Tempo: ${remainingTime}s`;
  botaoNovoJogo.style.display = "none";

  jogo.innerHTML = "";
  clearInterval(intervalo);

  intervalo = setInterval(() => {
    if (remainingTime > 0) {
      gerarBola(Math.floor(Math.random() * 3) + 1);
      atualizarTempo();
    }
  }, 1000);
}

function gerarBola(cor) {
  const bola = document.createElement("div");
  bola.classList.add("bola");

  switch (cor) {
    case 1:
      bola.classList.add("bola-azul");
      break;
    case 2:
      bola.classList.add("bola-rosa");
      break;
    case 3:
      bola.classList.add("bola-verde");
      break;
    default:
      break;
  }

  const leftPosition = Math.random() * (jogo.clientWidth - bola.offsetWidth);
  const topPosition = Math.random() * (jogo.clientHeight - bola.offsetHeight);

  bola.style.left = leftPosition + "px";
  bola.style.top = topPosition + "px";

  bola.addEventListener("click", function () {
    if (cor === 1) {
      document.getElementById("bolha-estoura").play();
      eliminarBola(bola);
      gerarBola(Math.floor(Math.random() * 3) + 1);
    }
  });

  bola.addEventListener("mouseover", function () {
    if (cor === 2) {
      document.getElementById("bolha-estoura").play();
      eliminarBola(bola);
      pontuar();
    } else if (cor === 3) {
      perderPontos();
    }
  });

  jogo.appendChild(bola);
}

function eliminarBola(bola) {
  if (
    bola.classList.contains("bola-azul") ||
    bola.classList.contains("bola-rosa") ||
    bola.classList.contains("bola-verde")
  ) {
    bola.parentNode.removeChild(bola);
    score++;
    pontuacao.textContent = `Pontuação: ${score}`;
  }
}

function perderPontos() {
  if (score > 0) {
    score--;
    pontuacao.textContent = `Pontuação: ${score}`;
  }
}

function pontuar() {
  score++;
  pontuacao.textContent = `Pontuação: ${score}`;
}

function atualizarTempo() {
  remainingTime--;
  tempo.textContent = `Tempo: ${remainingTime}s`;

  if (remainingTime === 0) {
    clearInterval(intervalo);
    alert(`Fim de jogo! Sua pontuação final: ${score}`);
    botaoNovoJogo.style.display = "block";
    BackMenu.style.display = "block";
  } else if (remainingTime < 0) {
    remainingTime = 0;
    tempo.textContent = `Tempo: ${remainingTime}s`;
  }
}

botaoNovoJogo.addEventListener("click", iniciarJogo);

document.addEventListener("keydown", function (event) {
  if (event.key === "d") {
    const primeiraBolaVerde = jogo.querySelector(".bola-verde");
    if (primeiraBolaVerde) {
      document.getElementById("bolha-estoura").play();
      eliminarBola(primeiraBolaVerde);
      gerarBola(Math.floor(Math.random() * 3) + 1);
    }
  }
});

// Inicia o jogo quando a página carregar
iniciarJogo();
