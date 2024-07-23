const axios = require('axios')
require('./config/env')

exports.sendAlert = async (message) => {
    const alertApiHost = process.env.ALERT_API_HOST ?? 'htpp://127.0.0.1:3000'
    const channel = process.env.CHANNEL ?? ''
    const payload = { channel: channel, message: message.replace(/ +/g, ' ') }
    const url = `${alertApiHost}/sendMessage`
    await axios.post(url, payload)
}
