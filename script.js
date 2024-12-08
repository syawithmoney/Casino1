// Game State
let userBalance = 1000;
let inventory = [];
const shopItems = [
    { id: 1, name: 'Moeda Dourada', price: 500, image: 'images/golden-coin.png' },
    { id: 2, name: 'Moeda de Diamante', price: 1000, image: 'images/diamond-coin.png' },
    { id: 3, name: 'Moeda Rara', price: 2000, image: 'images/rare-coin.png' }
];

// DOM Elements
const balanceDisplay = document.getElementById('userBalance');
const betAmount = document.getElementById('betAmount');
const coinImage = document.getElementById('coinImage');
const historyList = document.getElementById('historyList');
const shopModal = document.getElementById('shopModal');
const inventoryModal = document.getElementById('inventoryModal');
const shopButton = document.getElementById('shopButton');
const inventoryButton = document.getElementById('inventoryButton');

// Event Listeners
document.getElementById('betHeads').addEventListener('click', () => placeBet('cara'));
document.getElementById('betTails').addEventListener('click', () => placeBet('coroa'));
shopButton.addEventListener('click', () => shopModal.style.display = 'block');
inventoryButton.addEventListener('click', () => inventoryModal.style.display = 'block');

document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        shopModal.style.display = 'none';
        inventoryModal.style.display = 'none';
    });
});

// Game Functions
function placeBet(choice) {
    const amount = parseInt(betAmount.value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira uma quantidade válida para apostar.');
        return;
    }
    
    if (amount > userBalance) {
        alert('Saldo insuficiente!');
        return;
    }

    const result = Math.random() < 0.5 ? 'cara' : 'coroa';
    const won = choice === result;
    
    // Animate coin flip
    coinImage.classList.add('flip');
    setTimeout(() => {
        coinImage.classList.remove('flip');
        
        // Update balance
        userBalance += won ? amount : -amount;
        balanceDisplay.textContent = userBalance;
        
        // Add to history
        addToHistory(choice, amount, won);
        
        // Show result
        alert(won ? `Você ganhou ${amount} VC!` : `Você perdeu ${amount} VC!`);
    }, 1000);
}

function addToHistory(choice, amount, won) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span>Aposta: ${amount} VC - ${choice.toUpperCase()}</span>
        <span style="color: ${won ? '#00ff88' : '#ff6b6b'}">${won ? 'Ganhou' : 'Perdeu'}</span>
    `;
    historyList.insertBefore(historyItem, historyList.firstChild);
}

function buyItem(itemId) {
    const item = shopItems.find(item => item.id === itemId);
    if (!item) return;
    
    if (userBalance >= item.price) {
        userBalance -= item.price;
        balanceDisplay.textContent = userBalance;
        inventory.push(item);
        updateInventory();
        alert(`Você comprou ${item.name}!`);
    } else {
        alert('Saldo insuficiente!');
    }
}

function updateInventory() {
    const inventoryItems = document.getElementById('inventoryItems');
    inventoryItems.innerHTML = inventory.map(item => `
        <div class="item-card">
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
        </div>
    `).join('');
}

// Initialize shop items
document.getElementById('shopItems').innerHTML = shopItems.map(item => `
    <div class="item-card">
        <img src="${item.image}" alt="${item.name}">
        <p>${item.name}</p>
        <p>${item.price} VC</p>
        <button onclick="buyItem(${item.id})">Comprar</button>
    </div>
`).join('');