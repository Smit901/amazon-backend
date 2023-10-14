const fs = require('fs')
const path = require('path')
const { format } = require('date-fns')

const logDirectory = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}

const logger = {
  info: (message) => {
    log('info', message)
  },
  error: (message) => {
    log('error', message)
  },
  warn: (message) => {
    log('warn', message)
  },
  debug: (message) => {
    log('debug', message)
  }
}

function log (level, message) {
  const logMessage = `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] [${level.toUpperCase()}] ${message}\n`

  console.log(logMessage)

  const logFileName = path.join(logDirectory, `${format(new Date(), 'yyyy-MM-dd')}.log`)
  fs.appendFileSync(logFileName, logMessage, 'utf8')
}

module.exports = logger
