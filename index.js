const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOption} = require('./options')
const token = '5185517688:AAHFqZ_0Jn0xUtF4BYbufVqZxZMY4zcenH4'
const bot = new TelegramApi(token, {polling: true})
const chats = {}




bot.setMyCommands([
    {command: '/start',description: 'greeting'},
    {command: '/info',description: 'information'},
    {command: '/game',description: 'play game with this bot'}

])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `try to guess number that I wished for from 0 to 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `let's start!`, gameOption )
}


const start = () => {
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/1.webp')
            return bot.sendMessage(chatId, `welcome!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `your name ${msg.from.first_name || ''} ${msg.from.last_name || ''}`)
        }
        if (text === '/game') {
           return startGame(chatId)
        }
        return bot.sendMessage(chatId, `i don't understand you`)
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `you won! I guessed ${chats[chatId]}`, againOption)
        } else {
            return bot.sendMessage(chatId, `you lose(( I guessed ${chats[chatId]}`, againOption)
        }
        
    })

}

start()