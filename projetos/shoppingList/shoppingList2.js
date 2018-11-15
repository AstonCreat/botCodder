const env = require('../../.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');
const bot = new Telegraf(env.token);


const botoes = lista => Extra.markup(
  Markup.inlineKeyboard(
    lista.map(item => Markup.callbackButton(item, `delete ${item}`))
    , { columns: 3 }
  )
)

bot.use(session())

bot.start(async ctx => {
  const name = ctx.update.message.from.first_name;
  await ctx.reply(`Seja bem vindo, ${name}!`)
  await ctx.reply("Esta é uma lista de compra,"
    + " se precisar de ajuda digite /ajuda")
  await ctx.reply("Escreva os item que deseja adicionar...")
  ctx.session.lista = []
});

// add item
bot.on('text', ctx => {
  let msg = ctx.update.message.text
  ctx.session.lista.push(msg)
  ctx.reply(`${msg} adicionado!`, botoes(ctx.session.lista))
})

bot.command('ajuda', ctx => ctx.reply('/ajuda: vou mostra as opções:'
  + "\n 🗑 - Para apagar um item da lista, basta da um click sobre o mesmo!")
)


// deletando item
bot.action(/delete (.+)/, ctx => {
  ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1])
  ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista))
})

bot.startPolling();