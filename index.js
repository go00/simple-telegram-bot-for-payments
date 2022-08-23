const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN) // Token from .env file

const getInvoice = (id) => {
  const invoice = {
    chat_id: id, // The unique ID of the target chat or the username of the target channel
    provider_token: process.env.PROVIDER_TOKEN, // Token issued through any payment provider
    start_parameter: 'get_access', // A unique deep link setting. If left blank, forwarded copies of a sent message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with the value used as the initial parameter.
    title: 'Test payment', // Product name, 1-32 characters
    description: 'Test invoice', // Product description, 1-255 characters
    currency: 'RUB', // Three-letter ISO 4217 currency code
    prices: [{ label: 'Invoice Title', amount: 1000 * 100 }], // Price breakdown, JSON serialized list of components 100 cents * 100 = $100
    photo_url: '', // Product photo URL for invoice. It can be a product photo or an advertising image of a service.
    photo_width: 640, // Width photo
    photo_height: 640, // Height photo
    payload: { // Invoice payload defined by the bot, 1-128 bytes. This will not be displayed to the user, use it for your internal processes.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN 
    }
  }

  return invoice
}

bot.use(Telegraf.log())

bot.hears('/start', (ctx) => { // Specific text handler
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) // replyWithInvoice method for billing 
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) // Response to a preliminary request for payment

bot.on('successful_payment', async (ctx, next) => { // Answer for successful payment
  await ctx.reply('Your text here')
})

bot.launch()