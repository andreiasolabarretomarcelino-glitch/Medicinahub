<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Muitas Requisições | MedicinaHub</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
            background-color: #f7f7f7;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .error-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 40px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .error-code {
            font-size: 72px;
            font-weight: bold;
            color: #f39c12;
            margin: 0;
            line-height: 1;
        }
        
        .error-title {
            font-size: 24px;
            margin: 20px 0;
            color: #333;
        }
        
        .error-message {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
        }
        
        .error-countdown {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            color: #e67e22;
        }
        
        .error-actions {
            margin-top: 30px;
        }
        
        .btn {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 12px 25px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #2980b9;
        }
        
        .error-image {
            max-width: 200px;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1 class="error-code">429</h1>
        <h2 class="error-title">Muitas Requisições</h2>
        <p class="error-message">
            Você enviou muitas solicitações em um curto período de tempo.
            Por favor, aguarde um momento antes de tentar novamente.
        </p>
        <div class="error-image">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#f39c12">
                <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
            </svg>
        </div>
        <div class="error-countdown">
            <div id="countdown">Tente novamente em <span id="seconds">30</span> segundos</div>
        </div>
        <div class="error-actions">
            <a href="/" class="btn">Voltar para a Página Inicial</a>
        </div>
    </div>

    <script>
        // Countdown timer
        (function() {
            let retryAfter = <?php echo isset($_SERVER['HTTP_RETRY_AFTER']) ? (int)$_SERVER['HTTP_RETRY_AFTER'] : 30; ?>;
            const secondsDisplay = document.getElementById('seconds');
            const countdown = document.getElementById('countdown');
            
            const updateCountdown = () => {
                if (retryAfter <= 0) {
                    countdown.innerHTML = "Você pode tentar novamente agora. <a href='javascript:window.location.reload()'>Recarregar</a>";
                    return;
                }
                
                secondsDisplay.textContent = retryAfter;
                retryAfter--;
                setTimeout(updateCountdown, 1000);
            };
            
            updateCountdown();
        })();
    </script>
</body>
</html> 