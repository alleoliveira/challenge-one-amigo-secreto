// --- Bloco 1: Animações de Rolagem (ScrollReveal) ---
// Inicializa a biblioteca ScrollReveal.js para animar a entrada dos elementos na tela.
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", { ...scrollRevealOption, origin: "right" });
ScrollReveal().reveal(".header__content h1", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__content p", { ...scrollRevealOption, delay: 1000 });
ScrollReveal().reveal(".header__content form", { ...scrollRevealOption, delay: 1500 });
ScrollReveal().reveal(".header__image__card", { duration: 1000, interval: 500, delay: 2500 });


// --- Bloco 2: Lógica Principal da Aplicação ---
// Aguarda o carregamento completo do HTML para começar a manipular os elementos.
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os elementos do formulário que serão utilizados.
    const form = document.getElementById("secret-friend-form");
    const addParticipantBtn = document.getElementById("add-participant-btn");
    const container = document.getElementById("participant-inputs-container");
    const drawFriendBtn = document.getElementById("draw-friend-btn");
    const resetButton = document.getElementById("reset-btn");
    const resetContainer = document.getElementById("reset-container");

    // Função para limpar todas as mensagens e estilos de erro.
    function clearAllErrors() {
        container.querySelectorAll(".error-message").forEach(msg => msg.remove());
        container.querySelectorAll(".input__group.error").forEach(input => input.classList.remove("error"));
    }
    
    // Função para validar se o botão de sorteio pode ser habilitado.
    function validateDrawButton() {
        const inputs = container.querySelectorAll('input[name="name"]');
        let allFieldsFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                allFieldsFilled = false;
            }
        });
        drawFriendBtn.disabled = !(inputs.length >= 3 && allFieldsFilled);
    }

    // Função para validar todos os campos e exibir mensagens de erro se necessário.
    function validateAllFields() {
        clearAllErrors();
        const inputs = container.querySelectorAll('input[name="name"]');
        let allValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                allValid = false;
                const inputGroup = input.parentElement;
                inputGroup.classList.add("error");
                
                const errorMessage = document.createElement("span");
                errorMessage.classList.add("error-message");
                errorMessage.textContent = "Adicione um nome válido";
                inputGroup.appendChild(errorMessage);

                // Remove a mensagem de erro assim que o usuário começa a digitar.
                input.addEventListener('input', function() {
                    inputGroup.classList.remove('error');
                    const errorSpan = inputGroup.querySelector('.error-message');
                    if (errorSpan) errorSpan.remove();
                    validateDrawButton();
                }, { once: true });
            }
        });
        return allValid;
    }
    
    // Evento de clique para adicionar um novo participante.
    addParticipantBtn.addEventListener("click", function () {
        if (!validateAllFields()) {
            return; // Impede a adição se houver campos vazios.
        }
        // Cria e adiciona o novo campo de input ao DOM.
        const newRow = document.createElement("div");
        newRow.classList.add("input__row");
        const newGroup = document.createElement("div");
        newGroup.classList.add("input__group");
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = "name";
        newInput.placeholder = "Digite o nome do participante";
        newInput.required = true;
        newGroup.appendChild(newInput);
        newRow.appendChild(newGroup);
        container.appendChild(newRow);
        
        validateDrawButton();
        newInput.focus(); // Coloca o foco no novo campo.
    });

    // Evento de submissão do formulário, que dispara a lógica do sorteio.
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o recarregamento da página.
    
        if (!validateAllFields()) {
            return;
        }
    
        // Coleta os nomes dos participantes.
        const inputs = container.querySelectorAll('input[name="name"]');
        const participants = Array.from(inputs).map(input => input.value.trim());
    
        // Algoritmo de sorteio: embaralha a lista e garante que ninguém tire a si mesmo.
        let receivers = [...participants];
        let shuffled = false;
        while (!shuffled) {
            for (let i = receivers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
            }
    
            // Verifica se alguma pessoa tirou a si mesma.
            let selfAssigned = receivers.some((receiver, index) => receiver === participants[index]);
            if (!selfAssigned) {
                shuffled = true; // Se ninguém tirou a si mesmo, o sorteio é válido.
            }
        }
        
        // Exibe o resultado do sorteio na tela.
        inputs.forEach((input, index) => {
            const giver = participants[index];
            const receiver = receivers[index];
            input.value = `${giver} tirou -> ${receiver}`;
            input.disabled = true;
            input.style.textAlign = 'center';
            input.style.fontWeight = 'bold';
            input.style.color = 'var(--primary-color-dark)';
            input.classList.add('result-input');
        });
    
        // Oculta os botões de ação e exibe o botão de reiniciar.
        addParticipantBtn.parentElement.classList.add('hidden');
        drawFriendBtn.parentElement.classList.add('hidden');
        resetContainer.classList.remove('hidden');
    });
    
    // Evento de clique para o botão de reiniciar.
    resetButton.addEventListener('click', function() {
        location.reload(); // Recarrega a página para um novo sorteio.
    });

    // Valida o botão de sorteio em tempo real enquanto o usuário digita.
    container.addEventListener('input', validateDrawButton);

    // Aplica a animação de flutuação aleatória aos cards.
    const cards = document.querySelectorAll(".header__image__card");
    cards.forEach(card => {
        card.style.animationName = 'floatAnimation';
        card.style.animationIterationCount = 'infinite';
        card.style.animationTimingFunction = 'ease-in-out';
        const duration = Math.random() * 5 + 8;
        const delay = Math.random() * 5;
        card.style.animationDuration = `${duration}s`;
        card.style.animationDelay = `-${delay}s`;
    });

    // Ações que acontecem assim que a página carrega.
    const firstInput = container.querySelector('input[name="name"]');
    if (firstInput) {
        firstInput.focus(); // Coloca o foco no primeiro campo.
    }
    validateDrawButton(); // Garante que o botão de sorteio comece desabilitado.
});


// --- Bloco 3: Animação da Imagem Principal ---
// Faz a imagem principal seguir o movimento do mouse com um efeito 3D (paralaxe).
document.addEventListener("mousemove", function (e) {
  const giftsImage = document.getElementById("gifts-image");
  if (!giftsImage) return;

  // Calcula a posição do mouse em relação ao centro da tela.
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  
  const moveFactor = 20;
  const rotateFactor = 15;

  // Aplica as transformações de movimento e rotação à imagem.
  const moveX = x * moveFactor;
  const moveY = y * moveFactor;
  const rotateY = x * rotateFactor;
  const rotateX = y * -rotateFactor;

  giftsImage.style.transform = `
    translate(${moveX}px, ${moveY}px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg)
  `;
});