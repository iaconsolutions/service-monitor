const pm2 = require('pm2')
const { sendAlert } = require('./sendAlert')
require('./config/env')

function traduzirStatus(status) {
    switch (status) {
        case 'online':
            return 'online';
        case 'stopping':
            return 'parando';
        case 'stopped':
            return 'parado';
        case 'launching':
            return 'iniciando';
        case 'errored':
            return 'com erro';
        case 'one-launch-status':
            return 'em status de um único lançamento';
        default:
            return 'desconhecido';
    }
}

function getUsers() {
    const users = process.env.USERS ?? ''
    return users
}


function monitorProcesses() {
    pm2.connect((err) => {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        pm2.list((err, processDescriptionList) => {
            if (err) {
                console.error(err)
                process.exit(2)
            }

            processDescriptionList.forEach((process) => {
                if (process.pm2_env.status !== 'online') {
                    const { name, pm2_env } = process
                    const { status } = pm2_env
                    const users = getUsers()
                    const msg = `${users} ⚠️ Alerta: O serviço ${name} está atualmente ${traduzirStatus(status)}.`

                    sendAlert(msg)
                }
            })

            pm2.disconnect()

            setTimeout(monitorProcesses, 15000)
        })
    })
}

function listProcessesOnline() {
    pm2.connect((err) => {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        pm2.list((err, processDescriptionList) => {
            if (err) {
                console.error(err)
                process.exit(2)
            }

            let msg = '📋 Lista dos serviços:\n';

            processDescriptionList.forEach((process) => {
                const { name, pm2_env } = process
                const { status } = pm2_env
                msg += `- Nome: ${name}, Status: ${traduzirStatus(status)}\n`
            })

            sendAlert(msg)

            pm2.disconnect()

            setTimeout(listProcessesOnline, 300000)
        })
    })
}

listProcessesOnline()
monitorProcesses()
