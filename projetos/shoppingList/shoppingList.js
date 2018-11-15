const env = require('../../.env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const bot = new Telegraf(env.token);

let lista = [];

const generationBtn =() =>Extra.markup(
  Markup.inlineKeyboard(
    lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
    {columns : 3}
  )
);

bot.start(async ctx =>{
  const name = ctx.update.message.from.first_name;
  await ctx.reply(`Seja bem vindo, ${name}!`);

  await ctx.reply("Esta é uma lista de compra,"
    +" se precisar de ajuda digite /ajuda"
    +"\n Escreva os item que deseja adicionar..." );
});
bot.command('ajuda',ctx => ctx.reply('/ajuda: vou mostra as opções:'
+"\n 🗑 - Para apagar um item da lista, basta da um click sobre o mesmo!"))
// add item
bot.on('text', ctx =>{
  lista.push(ctx.update.message.text);
  ctx.reply(`${ctx.update.message.text} adicionado`, generationBtn());
  
});
// deletando item
bot.action(/delete (.+)/, ctx =>{
  lista = lista.filter(item => item !== ctx.match[1]);
  ctx.reply(`${ctx.match[1]} deletado!`,generationBtn());
});

bot.startPolling();

