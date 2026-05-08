const botaoSim = document.getElementById("sim");
const botaoNao = document.getElementById("nao");
const canvas = document.getElementById("fogos");
const ctx = canvas.getContext("2d");
const mensagem = document.getElementById("mensagem");
const som = document.getElementById("somFogos");
const game = document.querySelector(".game");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fogos = [];
let particulas = [];

/* BOTÃO NÃO FOGE */
function teleportarBotao() {
    const larguraBotao = botaoNao.offsetWidth;
    const alturaBotao = botaoNao.offsetHeight;

    const larguraTela = document.body.clientWidth;
    const alturaTela = document.body.clientHeight;

    const distanciaMinima = 200; // distância mínima do botão "Sim"

    let novaPosicaoX, novaPosicaoY;
    let distancia;

    do {
        novaPosicaoX = Math.random() * (larguraTela - larguraBotao);
        novaPosicaoY = Math.random() * (alturaTela - alturaBotao);

        const rectSim = botaoSim.getBoundingClientRect();

        const centroSimX = rectSim.left + rectSim.width / 2;
        const centroSimY = rectSim.top + rectSim.height / 2;

        const centroNaoX = novaPosicaoX + larguraBotao / 2;
        const centroNaoY = novaPosicaoY + alturaBotao / 2;

        distancia = Math.sqrt(
            Math.pow(centroSimX - centroNaoX, 2) +
            Math.pow(centroSimY - centroNaoY, 2)
        );

    } while (distancia < distanciaMinima);

    botaoNao.style.position = "absolute";
    botaoNao.style.left = novaPosicaoX + "px";
    botaoNao.style.top = novaPosicaoY + "px";
}

botaoNao.addEventListener("mouseover", teleportarBotao);

/* CLASSE FOGUETE */
class Foguete {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.speed = Math.random() * 3 + 5;
        this.color = `hsl(${Math.random() * 360},100%,50%)`;
    }

    update() {
        this.y -= this.speed;
        if (this.y < Math.random() * canvas.height / 2) {
            this.explodir();
            return true;
        }
        return false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    explodir() {
        for (let i = 0; i < 100; i++) {
            particulas.push(new Particula(this.x, this.y, this.color));
        }
        som.currentTime = 0;
        som.play();
    }
}

/* CLASSE PARTÍCULA */
class Particula {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.gravity = 0.05;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

/* ANIMAÇÃO CONTÍNUA */
function animarFogos() {
    requestAnimationFrame(animarFogos);

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.08) {
        fogos.push(new Foguete());
    }

    fogos = fogos.filter(f => {
        f.draw();
        return !f.update();
    });

    particulas = particulas.filter(p => {
        p.update();
        p.draw();
        return p.alpha > 0;
    });
}

/* AO CLICAR NO SIM */
botaoSim.addEventListener("click", function() {

    game.style.display = "none";
    document.body.classList.add("escuro");
    mensagem.classList.add("ativo");

    animarFogos(); // inicia fogos infinitos
});
