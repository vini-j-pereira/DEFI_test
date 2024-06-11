// Carregar ethers.js e conectar à rede Ethereum usando Infura ou outra API
const provider = new ethers.providers.InfuraProvider('mainnet', '6d98166487ab4625a3826e6b7ab01920');

// Endereço e ABI do contrato Uniswap V2 Router
const uniswapRouterAddress = '0x7a250d5630b4cf539739df2c5dacab264c11f7ac';
let uniswapRouterABI;

// Carregar a ABI do contrato Uniswap V2 Router usando Fetch
fetch('./IUniswapV2Router02.json')
    .then(response => response.json())
    .then(data => {
        uniswapRouterABI = data;

        // Criar uma instância do contrato Uniswap V2 Router
        const uniswapRouter = new ethers.Contract(uniswapRouterAddress, uniswapRouterABI, provider);

        // Verificar se a instância do contrato foi criada corretamente
        console.log('Instância do contrato Uniswap V2 Router:', uniswapRouter);
    })
    .catch(error => {
        console.error('Erro ao carregar a ABI do contrato:', error);
    });

async function loadTokens() {
    // Exemplo de tokens - você pode carregar dinamicamente da API Uniswap ou usar uma lista predefinida
    const tokens = [
        { symbol: 'ETH', address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
        { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f' }
    ];

    const fromTokenSelect = document.getElementById('from-token');
    const toTokenSelect = document.getElementById('to-token');

    tokens.forEach(token => {
        const option = document.createElement('option');
        option.value = token.address;
        option.textContent = token.symbol;
        fromTokenSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = token.address;
        option2.textContent = token.symbol;
        toTokenSelect.appendChild(option2);
    });
}

async function swapTokens() {
    const fromToken = document.getElementById('from-token').value;
    const toToken = document.getElementById('to-token').value;
    const fromAmount = document.getElementById('from-amount').value;

    // Aqui você precisa conectar a carteira do usuário usando MetaMask
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const uniswapRouterWithSigner = uniswapRouter.connect(signer);

    const fromAmountInWei = ethers.utils.parseUnits(fromAmount, 18);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos a partir de agora

    const tx = await uniswapRouterWithSigner.swapExactTokensForTokens(
        fromAmountInWei,
        0, // Aceitar qualquer quantidade mínima de saída
        [fromToken, toToken],
        userAddress,
        deadline
    );

    console.log('Swap transaction sent:', tx.hash);
}

document.getElementById('swap-button').addEventListener('click', swapTokens);

window.onload = loadTokens;




