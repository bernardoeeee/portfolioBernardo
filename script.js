


let idiomaAtual = 'pt-br';

function exibirTextoNaTela(tag, texto) {
    let campo = document.querySelectorAll(tag);
    campo.forEach((campo, index) => {
        if (index < texto.length) {
            campo.innerHTML = texto[index];
        }
    });
}

function exibirTextoFormulario(id) {
    const campo = document.getElementById(id);
    if (idiomaAtual === 'pt-br') {
        if (campo.id === 'nome') {
            campo.placeholder = "Digite seu nome";
        } else if (campo.id === 'mensagem') {
            campo.placeholder = "Digite sua mensagem";
        } else if (id === 'enviar') {
            campo.innerText = "Enviar WhatsApp";
        }
    } else if (idiomaAtual === 'usa') {
        if (id === 'nome') {
            campo.placeholder = "Enter your name";
        } else if (id === 'mensagem') {
            campo.placeholder = "Enter your message";
        } else if (id === 'enviar') {
            campo.innerText = "Send Whatsapp";
        }
    }

}


// PORTUGUÊS
function exibirMensagemHeaderPT() {
    const texto = ["Início", "Sobre Mim", "Projetos", "Contato"];
    exibirTextoNaTela("a", texto);
}

function exibirMensagemInicioPT() {
    const texto = ["Portfólio", "Transformando ideias em códigos eficientes 🚀", "Do aprendizado à prática: minha trajetória 💡💻", "Portfólio"]
    exibirTextoNaTela("h1", texto)
}

function exibirMensagemInicioPPT() {
    const texto = ["Transforme suas ideias em código e crie seu site como nunca antes! 🚀 Com design moderno, performance otimizada e as melhores tecnologias, seu projeto sai do papel e ganha vida na web.", "Meu nome é Bernardo Varisco Fleck, tenho 18 anos e sou natural do Rio Grande do Sul. Resido em Portão e atualmente estudo no Senac RS, onde curso Técnico em Programação. Paralelamente, também aprimoro meus conhecimentos por meio dos cursos da Alura e da Udemy, buscando ampliar minha base técnica e prática. Atualmente, realizo estágio na BEG Support, o que tem contribuído significativamente para meu desenvolvimento profissional e pessoal, oferecendo vivência real na área de tecnologia. Estou sempre em busca de novos aprendizados e desafios, pois meu objetivo é construir uma carreira sólida, consistente e promissora no mundo da programação."]
    exibirTextoNaTela("p", texto)
}

function exibirMensagemInicioH2PT() {
    const texto = ["Sobre mim", "Projetos", "Hackaton + Saúde", "SmartFlow", "FoodMind", "DevFeira", "Entre em contato"]
    exibirTextoNaTela("h2", texto)
}

function exibirMensagemInicioH4PT() {
    const texto = ['Projeto para ajudar hospitais a localizar ferramentas perdidas em cirurgias e limpeza', 'A SmartFlow é uma plataforma desenvolvida para facilitar a organização das turmas de uma escola', 'FoodMind é um site pensando para sua alimentação', 'Uma plataforma onde os usuários podem oferecer e pedir ajuda sobre programação, design e projetos']
    exibirTextoNaTela('h4', texto)
}

// INGLÊS
function exibirMensagemHeaderUSA() {
    const texto = ["Home", "About Me", "Projects", "Contact"];
    exibirTextoNaTela("a", texto);
}

function exibirMensagemInicioUSA() {
    const texto = ["Portfolio", "Turning ideas into efficient codes 🚀", "My journey: from learning to applying 💡💻", "Portfolio"]
    exibirTextoNaTela("h1", texto)
}

function exibirMensagemInicioPUSA() {
    const texto = ["Turn your ideas into code and create your website like never before! 🚀 With a modern design, optimized performance and the best technologies, your project goes from paper to life on the web.", "My name is Bernardo Varisco Fleck, I am 18 years old and I am from Rio Grande do Sul. I live in Portão and currently study at Senac RS, where I am taking a Technical Programming course. In parallel, I also improve my knowledge through courses from Alura and Udemy, seeking to expand my technical and practical base. Currently, I am doing an internship at BEG Support, which has significantly contributed to my professional and personal development, offering real-world experience in the technology field. I am always looking for new learning opportunities and challenges, as my goal is to build a solid, consistent, and promising career in the world of programming."]
    exibirTextoNaTela("p", texto)
}

function exibirMensagemInicioH2USA() {
    const texto = ["About Me", "Projects", "Hackathon + Health", "SmartFlow", "FoodMind", "DevFeira", "Get in touch"]
    exibirTextoNaTela("h2", texto)
}

function exibirMensagemInicioH4USA() {
    const texto = ['Project to help hospitals locate tools lost during surgeries and cleaning', 'SmartFlow is a platform developed to facilitate the organization of classes in a school', 'FoodMind is a website designed for your nutrition', 'A platform where users can offer and ask for help with programming, design, and projects']
    exibirTextoNaTela('h4', texto)
}

const projetosPT = [
    {
        titulo: "Hackaton + Saúde",
        observacao: "Desenvolvemos uma aplicação com funcionalidade CRUD voltada para auxiliar hospitais na localização de ferramentas utilizadas em cirurgias e processos de limpeza. A plataforma permite o registro, busca, atualização e remoção de instrumentos, oferecendo mais controle e segurança durante os procedimentos médicos.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        titulo: "SmartFlow",
        observacao: "A SmartFlow é uma plataforma desenvolvida para otimizar a administração de turmas no ambiente escolar, integrando em um único sistema os módulos de gestão de professores, alunos, registros de presença e desempenho acadêmico. Sua proposta central é fornecer um fluxo de trabalho mais ágil e eficiente, garantindo controle estruturado das rotinas pedagógicas e administrativas. Cada usuário possui acesso segmentado e seguro, visualizando apenas os dados e funcionalidades compatíveis com seu perfil e nível de permissão dentro da plataforma.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        titulo: "FoodMind",
        observacao: "O FoodMind é uma aplicação web desenvolvida em JavaScript com arquitetura cliente-servidor, voltada para o acompanhamento nutricional, controle de hábitos alimentares e gestão de lembretes e eventos pessoais, além de integrar funcionalidades de comunicação e personalização de perfil.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL", "Socket.io"]
    },
    {
        titulo: "DevFeira",
        observacao: "O projeto consistiu na criação de uma plataforma onde os usuários podem oferecer e pedir ajuda sobre programação, design e projetos. Desenvolvemos uma página inicial, páginas de cadastro e login, e três áreas específicas: desenvolvedores, designers e projetos. Nelas, os usuários podem postar dúvidas ou dicas acompanhadas de imagens.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    }
];


const projetosUSA = [
    {
        titulo: "Hackathon + Health",
        observacao: "We developed a CRUD application designed to help hospitals locate tools used in surgeries and cleaning processes. The platform allows registration, search, updating, and removal of instruments, offering more control and safety during medical procedures.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        titulo: "SmartFlow",
        observacao: "SmartFlow is a platform developed to optimize class administration in the school environment, integrating teacher management, student management, attendance records, and academic performance modules into a single system. Its main goal is to provide a more agile and efficient workflow, ensuring structured control of pedagogical and administrative routines. Each user has segmented and secure access, viewing only data and functionalities compatible with their profile and permission level within the platform.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        titulo: "FoodMind",
        observacao: "FoodMind is a web application developed in JavaScript with client-server architecture, focused on nutritional monitoring, dietary habit control, and management of personal reminders and events, in addition to integrating communication features and profile customization.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL", "Socket.io"]
    },
    {
        titulo: "DevFeira",
        observacao: "The project consisted of creating a platform where users can offer and request help with programming, design, and projects. We developed a home page, registration and login pages, and three specific areas: developers, designers, and projects. In these areas, users can post questions or tips accompanied by images.",
        linguagens: ["HTML", "CSS", "JavaScript", "MySQL"]
    }
];


let projetos = projetosPT;


const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalTopics = document.getElementById('modalTopics');
const modalSteps = document.getElementById('modalSteps');
const closeBtn = document.getElementById('closeModal');


cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;

        const projeto = projetos[index];
        modalTitle.innerText = projeto.titulo;
        modalTopics.innerText = projeto.observacao;
        modalSteps.innerHTML = projeto.linguagens.map(linguagens => `<li>${linguagens}</li>`).join('');
        modal.style.display = 'block';
    });
});

function fecharModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', fecharModal);

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        fecharModal();
    }
});


function langPTbr(event) {
    event.preventDefault();
    idiomaAtual = 'pt-br';
    projetos = projetosPT;

    exibirMensagemHeaderPT();
    exibirMensagemInicioPT();
    exibirMensagemInicioPPT();
    exibirMensagemInicioH2PT();
    exibirMensagemInicioH4PT();
    exibirTextoFormulario('nome');
    exibirTextoFormulario('mensagem');
    exibirTextoFormulario('enviar');
}


function langUSA(event) {
    event.preventDefault();
    idiomaAtual = 'usa';
    projetos = projetosUSA;

    exibirMensagemHeaderUSA();
    exibirMensagemInicioUSA();
    exibirMensagemInicioPUSA();
    exibirMensagemInicioH2USA();
    exibirMensagemInicioH4USA();
    exibirTextoFormulario('nome');
    exibirTextoFormulario('mensagem');
    exibirTextoFormulario('enviar');
}


exibirMensagemHeaderPT();
exibirMensagemInicioPT();
exibirMensagemInicioPPT();
exibirMensagemInicioH2PT();
exibirMensagemInicioH4PT();
exibirTextoFormulario('nome');
exibirTextoFormulario('mensagem');
exibirTextoFormulario('enviar');

function enviarWhats(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const telefone = '5551997076102';

    const textos = `Ola!! Me chamo ${nome}, ${mensagem}`;
    const msgFormatada = encodeURIComponent(textos);
    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;

    window.open(url, '_blank');
}
