// Seleciona o botão pelo ID
const backToTopButton = document.getElementById('rodape-btn');

// Adiciona um "listener" para o evento de clique no botão
backToTopButton.addEventListener('click', function() {
    scrollToTop(600); // Chama a função de rolagem, definindo a duração em milissegundos (aqui, 1000ms = 1 segundo)
});

// Função para rolar suavemente para o topo com duração controlada
function scrollToTop(duration) {
    const start = window.pageYOffset; // Posição inicial da rolagem
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime(); // Tempo de início da animação

    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
    // Esta é uma função de "easing" que faz a animação começar e terminar suavemente.

    function animateScroll() {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = currentTime - startTime;

        const run = easeInOutQuad(timeElapsed, start, -start, duration);
        window.scrollTo(0, run);

        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll); // Continua a animação no próximo quadro
        } else {
            window.scrollTo(0, 0); // Garante que a rolagem termine exatamente no topo
        }
    }

    animateScroll(); // Inicia a animação
}