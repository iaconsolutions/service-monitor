const pm2 = require('pm2')
const { sendAlert } = require('./sendAlert')
require('./config/env')

function traduzirStatus(status) {
    switch (status) {
        case 'online':
            return 'online'
        case 'stopping':
            return 'parando'
        case 'stopped':
            return 'parado'
        case 'launching':
            return 'iniciando'
        case 'errored':
            return 'com erro'
        case 'one-launch-status':
            return 'em status de um único lançamento'
        default:
            return 'desconhecido'
    }
}

function getUsers() {
    const users = process.env.USERS ?? ''
    return users
}

function monitorProcesses() {
    pm2.list((err, processDescriptionList) => {
        if (err) {
            console.error(err)
            pm2.disconnect()
            return
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

        setTimeout(monitorProcesses, 30000)
    })
}

function listProcessesOnline() {
    pm2.list((err, processDescriptionList) => {
        if (err) {
            console.error(err)
            pm2.disconnect()
            return
        }

        let msg = '📋 Lista dos serviços:\n'

        processDescriptionList.forEach((process) => {
            const { name, pm2_env } = process
            const { status } = pm2_env
            msg += `• [${name}]: ${traduzirStatus(status)}\n`
        })

        sendAlert(msg)

        setTimeout(listProcessesOnline, 3600000)
    })
}

pm2.connect((err) => {
    if (err) {
        console.error(err)
        process.exit(2)
    }

    monitorProcesses()
    listProcessesOnline()
})
