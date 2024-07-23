# Monitoramento de Serviços

Este projeto é um serviço de monitoramento que verifica o status de processos gerenciados pelo PM2 e envia alertas via Telegram quando algum serviço não está online.

## Funcionalidades

- Monitora o status dos processos gerenciados pelo PM2.
- Envia alertas via Telegram quando algum serviço não está online.
- Lista o status de todos os serviços.

## Pré-requisitos

- Node.js (v14 ou superior)
- PM2
- [Telegram Alert Microservice](https://github.com/iaconsolutions/telegram-alert-microservice)
- ID do chat ou grupo do Telegram

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/iaconsolutions/service-monitor.git
   cd service-monitor
   
2. Instale as dependências:

   ```bash
   cd service-monitor
   npm install
   ```
3. Inicie o servidor:

    ```bash
    npm run start
    ```