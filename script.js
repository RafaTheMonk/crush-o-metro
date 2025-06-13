// --- Elementos do DOM ---
const name1Input = document.getElementById('name1');
const name2Input = document.getElementById('name2');
const calculateBtn = document.getElementById('calculate-btn');
const errorMessage = document.getElementById('error-message');
const resultArea = document.getElementById('result-area');
const resultPercentage = document.getElementById('result-percentage');
const resultImage = document.getElementById('result-image');

// --- Elementos de Partilha ---
const shareArea = document.getElementById('share-area');
const shareableImage = document.getElementById('shareable-image');
const downloadBtn = document.getElementById('download-btn');
const shareableCanvas = document.getElementById('shareableCanvas');
const shareableCtx = shareableCanvas.getContext('2d');

// --- Elementos de Ações Extras ---
const analysisBtn = document.getElementById('analysis-btn');
const dateIdeaBtn = document.getElementById('date-idea-btn');
const analysisResult = document.getElementById('analysis-result');
const dateIdeaResult = document.getElementById('date-idea-result');

// --- Canvas e Variáveis de Estado ---
const loveCanvas = document.getElementById('loveCanvas');
const loveCtx = loveCanvas.getContext('2d');
let currentPercentage = 0;

// --- Event Listeners ---
calculateBtn.addEventListener('click', () => {
    // Esconde resultados anteriores ao calcular novamente
    resultArea.classList.remove('show');
    shareArea.classList.add('hidden');
    analysisResult.classList.add('hidden');
    dateIdeaResult.classList.add('hidden');

    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();

    if (name1 === '' || name2 === '') {
        errorMessage.classList.add('visible');
        return;
    }

    errorMessage.classList.remove('visible');

    currentPercentage = calculateLove(name1, name2);
    resultPercentage.textContent = `${currentPercentage}% de Compatibilidade!`;
    generateInitialImage(name1, name2, currentPercentage);
    resultArea.classList.add('show');
});

resultImage.addEventListener('click', () => {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    generateShareableImage(name1, name2);
    shareArea.classList.remove('hidden');
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compatibilidade-amor.png';
    link.href = shareableImage.src;
    link.click();
});

// --- Funções de Cálculo e Geração de Imagem ---
function calculateLove(name1, name2) {
    const combinedNames = (name1 + name2).toLowerCase();
    let sum = 0;
    for (let i = 0; i < combinedNames.length; i++) {
        sum += combinedNames.charCodeAt(i);
    }
    return (sum % 61) + 40; // Garante que o resultado esteja entre 40% e 100%
}

function generateInitialImage(name1, name2, percentage) {
    loveCtx.clearRect(0, 0, loveCanvas.width, loveCanvas.height);
    const gradient = loveCtx.createLinearGradient(0, 0, loveCanvas.width, loveCanvas.height);
    gradient.addColorStop(0, '#fff0f3');
    gradient.addColorStop(1, '#ffb3c1');
    loveCtx.fillStyle = gradient;
    loveCtx.fillRect(0, 0, loveCanvas.width, loveCanvas.height);

    loveCtx.fillStyle = 'rgba(255, 77, 109, 0.8)';
    drawHeart(loveCtx, 250, 80, 120);

    loveCtx.fillStyle = '#ffffff';
    loveCtx.font = 'bold 40px Poppins';
    loveCtx.textAlign = 'center';
    loveCtx.textBaseline = 'middle';
    loveCtx.fillText(`${percentage}%`, 250, 140);

    loveCtx.fillStyle = '#590d22';
    loveCtx.font = '50px Pacifico';
    loveCtx.fillText(name1, 250, 60);
    loveCtx.fillText(name2, 250, 240);
    resultImage.src = loveCanvas.toDataURL('image/png');
}

function generateShareableImage(name1, name2) {
    shareableCtx.clearRect(0, 0, shareableCanvas.width, shareableCanvas.height);
    const gradient = shareableCtx.createLinearGradient(0, 0, shareableCanvas.width, shareableCanvas.height);
    gradient.addColorStop(0, '#fff0f3');
    gradient.addColorStop(1, '#ffb3c1');
    shareableCtx.fillStyle = gradient;
    shareableCtx.fillRect(0, 0, shareableCanvas.width, shareableCanvas.height);

    shareableCtx.fillStyle = 'rgba(255, 77, 109, 0.8)';
    drawHeart(shareableCtx, 140, 150, 80); // Coração da esquerda
    drawHeart(shareableCtx, 360, 150, 80); // Coração da direita

    shareableCtx.fillStyle = '#ffffff';
    shareableCtx.font = 'bold 30px Poppins';
    shareableCtx.textAlign = 'center';
    shareableCtx.textBaseline = 'middle';
    shareableCtx.fillText(name1, 140, 100);
    shareableCtx.fillText(name2, 360, 100);

    shareableImage.src = shareableCanvas.toDataURL('image/png');
}

function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2 * 1.2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2 * 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
}

// --- Funções para Ações Extras (usando uma API como Gemini) ---
analysisBtn.addEventListener('click', async () => {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    const prompt = `Você é um astrólogo do amor divertido. Com base nos nomes ${name1} e ${name2} e uma pontuação de compatibilidade de ${currentPercentage}%, escreva uma análise curta (2-3 frases), otimista e divertida sobre o relacionamento deles. Use um tom lúdico e criativo. Responda em português.`;
    showLoading(analysisResult);
    const analysisText = await callGenerativeAPI(prompt);
    showResult(analysisResult, 'Análise Mágica ✨', analysisText);
});

dateIdeaBtn.addEventListener('click', async () => {
    const name1 = name1Input.value.trim();
    const name2 = name2Input.value.trim();
    const prompt = `Com base nos nomes ${name1} e ${name2}, que têm uma compatibilidade de ${currentPercentage}%, sugira uma ideia criativa e divertida para um primeiro encontro. Seja específico e original (1-2 frases). Responda em português.`;
    showLoading(dateIdeaResult);
    const dateText = await callGenerativeAPI(prompt);
    showResult(dateIdeaResult, 'Encontro Perfeito ✨', dateText);
});

function showLoading(element) {
    element.classList.remove('hidden');
    element.innerHTML = '<div class="loading-spinner"></div>';
    // Garante que apenas um resultado seja mostrado por vez
    analysisResult.classList.toggle('hidden', element !== analysisResult);
    dateIdeaResult.classList.toggle('hidden', element !== dateIdeaResult);
}

function showResult(element, title, text) {
    element.innerHTML = `<h3>${title}</h3><p>${text.replace(/\n/g, '<br>')}</p>`;
}

async function callGenerativeAPI(prompt) {
    const apiKey = "removi a chave por motivos de segurança"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Não foi possível gerar uma resposta. Tente novamente!";
        }
    } catch (error) {
        console.error("Erro ao chamar a API Generativa:", error);
        return "Ocorreu um erro mágico! Por favor, tente novamente mais tarde.";
    }
}
