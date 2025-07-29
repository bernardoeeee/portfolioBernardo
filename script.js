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
    const texto = ["Sobre mim", "Projetos", "Hackaton + Saúde", "Estacionei", "Troca sincera", "DevFeira", "Entre em contato"]
    exibirTextoNaTela("h2", texto)
}


function exibirMensagemInicioH4PT() {
    const texto = ['Projeto para ajudar hospitais a localizar ferramentas perdidas em cirurgias e limpeza.', 'CRUD para estacionamento: registro de veículos e seleção de vagas.', 'Projeto em Python: um chat onde você pode conversar com outra pessoa.', 'Uma plataforma onde os usuários podem oferecer e pedir ajuda sobre programação, design e projetos.']
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
    const texto = ["About Me", "Projects", "Hackathon + Health", "Car parking", "Sincere exchange", "DevFeira", "Get in touch"]
    exibirTextoNaTela("h2", texto)
}


function exibirMensagemInicioH4USA() {
    const texto = ['Project to help hospitals locate tools lost during surgeries and cleaning.', 'CRUD for parking: vehicle registration and space selection.', 'Python project: a chat where you can talk to another person.', 'A platform where users can offer and ask for help with programming, design, and projects.']
    exibirTextoNaTela('h4', texto)
}

function langUSA(event) {
    event.preventDefault()

    exibirMensagemHeaderUSA()
    exibirMensagemInicioUSA()
    exibirMensagemInicioPUSA()
    exibirMensagemInicioH2USA()
    exibirMensagemInicioH4USA()
}

const projetos = [
    {
        titulo: "Hackaton + Saúde",
        observacao: "Desenvolvemos uma aplicação com funcionalidade CRUD voltada para auxiliar hospitais na localização de ferramentas utilizadas em cirurgias e processos de limpeza. A plataforma permite o registro, busca, atualização e remoção de instrumentos, oferecendo mais controle e segurança durante os procedimentos médicos.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        titulo: "Estacionei",
        observacao: "Criamos um sistema utilizando operações CRUD para realizar o registro de veículos, gerenciamento e seleção de vagas em estacionamentos. A plataforma permite controle em tempo real da ocupação, além de manter histórico das entradas e saídas dos automóveis.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]

    },
    {
        titulo: "Troca Sincera",
        observacao: "Desenvolvemos um sistema de chat utilizando exclusivamente Python. O projeto permite a comunicação entre dois usuários, funcionando como um canal de troca de mensagens em tempo real. Focamos na lógica de envio e recebimento de mensagens.",
        linguagens: ["Python"]

    },
    {
        titulo: "DevFeira",
        observacao: "O projeto consistiu na criação de uma plataforma onde os usuários podem oferecer e pedir ajuda sobre programação, design e projetos. Desenvolvemos uma página inicial, páginas de cadastro e login, e três áreas específicas: desenvolvedores, designers e projetos. Nelas, os usuários podem postar dúvidas ou dicas acompanhadas de imagens.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]

    }
];

const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalTopics = document.getElementById('modalTopics');
const modalSteps = document.getElementById('modalSteps');
const closeBtn = document.getElementById('closeModal');


cards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const projeto = projetos[index];
        modalTitle.innerText = projeto.titulo;
        modalTopics.innerText = projeto.observacao;
        modalSteps.innerHTML = projeto.linguagens.map(linguagens => `<li>${linguagens}</li>`).join('');
        modal.style.display = 'block';
    });
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; //
    });
});


function fecharModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', fecharModal);

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        fecharModal();
    }
});



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
