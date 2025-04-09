function exibirTextoNaTela(tag, texto) {
    let campo = document.querySelectorAll(tag);
    // campo.innerHTML = texto;


    campo.forEach((campo, index) => {
        if (index < texto.length) {
            campo.innerHTML = texto[index];
        }
    });
}




function exibirMensagemHeaderPT() {
    const texto = ["Início", "Sobre Mim", "Projetos", "Contato"]; // Array com os textos
    exibirTextoNaTela("a", texto);
}

function exibirMensagemInicioPT() {
    const texto = ["Portfólio", "Transformando ideias em códigos eficientes 🚀", "Do aprendizado à prática: minha trajetória 💡💻"]
    exibirTextoNaTela("h1", texto)
}


function exibirMensagemInicioPPT() {
    const texto = ["Transforme suas ideias em código e crie seu site como nunca antes! 🚀 Com design moderno, performance otimizada e as melhores tecnologias, seu projeto sai do papel e ganha vida na web.", "Meu nome é Bernardo Varisco Fleck, tenho 17 anos e sou natural do Rio Grande do Sul. Moro na cidade de Portão e atualmente estudo no Senac RS, onde faço o curso técnico em programação. Além disso, também estou me aprimorando na área através do curso de programação da Alura. Atualmente, faço estágio na Brigada Militar de Portão, o que me proporciona experiência profissional e desenvolvimento pessoal. Estou sempre em busca de aprender mais e evoluir na área da tecnologia, pois meu objetivo é construir uma carreira sólida e promissora no mundo da programação."]
    exibirTextoNaTela("p", texto)
}


function exibirMensagemInicioH2PT() {
    const texto = ["Sobre mim", "Projetos", "Hackaton + Saúde", "Estacionei", "Troca sincera", "Jogo da adivinhação", "Entre em contato"]
    exibirTextoNaTela("h2", texto)
}


function exibirMensagemInicioH4PT() {
    const texto = ['Projeto para ajudar hospitais a localizar ferramentas perdidas em cirurgias e limpeza.', 'CRUD para estacionamento: registro de veículos e seleção de vagas.', 'Projeto em Python: um chat onde você pode conversar com outra pessoa.', 'Projeto da ALURA, gera um número aleatorio que podemos adivinhar.']
    exibirTextoNaTela('h4', texto)
}




exibirMensagemHeaderPT()
exibirMensagemInicioPT()
exibirMensagemInicioPPT()
exibirMensagemInicioH2PT()
exibirMensagemInicioH4PT()


function langPTbr(event) {
    event.preventDefault()

    exibirMensagemHeaderPT()
    exibirMensagemInicioPT()
    exibirMensagemInicioPPT()
    exibirMensagemInicioH2PT()
    exibirMensagemInicioH4PT()
}

// INGLES

function exibirMensagemHeaderUSA() {
    const texto = ["Home", "About Me", "Projects", "Contact"];
    exibirTextoNaTela("a", texto);
}

function exibirMensagemInicioUSA() {
    const texto = ["Portfolio", "Turning ideas into efficient codes 🚀", "My journey: from learning to applying 💡💻"]
    exibirTextoNaTela("h1", texto)
}


function exibirMensagemInicioPUSA() {
    const texto = ["Turn your ideas into code and create your website like never before! 🚀 With a modern design, optimized performance and the best technologies, your project goes from paper to life on the web.", "My name is Bernardo Varisco Fleck, I am 17 years old and I am from Rio Grande do Sul. I live in the city of Portão and I am currently studying at Senac RS, where I am taking a technical course in programming. In addition, I am also improving my skills in the area through the programming course at Alura. I am currently doing an internship at the Military Police of Portão, which provides me with professional experience and personal development. I am always looking to learn more and evolve in the technology area, as my goal is to build a solid and promising career in the world of programming."]
    exibirTextoNaTela("p", texto)
}


function exibirMensagemInicioH2USA() {
    const texto = ["About Me", "Projects", "Hackathon + Health", "Car parking", "Sincere exchange", "Guessing game", "Call me"]
    exibirTextoNaTela("h2", texto)
}


function exibirMensagemInicioH4PUSA() {
    const texto = ['Project to help hospitals locate tools lost during surgeries and cleaning.', 'CRUD for parking: vehicle registration and space selection.', 'Python project: a chat where you can talk to another person.', 'ALURA project, generates a random number that we can guess.']
    exibirTextoNaTela('h4', texto)
}

function langUSA(event) {
    event.preventDefault()

    exibirMensagemHeaderUSA()
    exibirMensagemInicioUSA()
    exibirMensagemInicioPUSA()
    exibirMensagemInicioH2USA()
    exibirMensagemInicioH4PUSA()
}



// ENVIAR MENSAGEM
function enviarWhats(event) {
    event.preventDefault()

    const nome = document.getElementById('nome').value
    const mensagem = document.getElementById('mensagem').value
    const telefone = '5551997076102'

    const textos = `Ola!! Me chamo ${nome}, ${mensagem}`

    const msgFormatada = encodeURIComponent(textos)


    const url = `https://wa.me/${telefone}?text=${msgFormatada}`

    window.open(url, '_blank')

    console.log(url)
}
