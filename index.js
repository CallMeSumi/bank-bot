const Discord = require('discord.js');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const { prefix, token, sskey } = require('./bankconfig.json');
const creds = require('./client_secret.json');

const client = new Discord.Client();

async function accessSpreadsheet(){
    const doc = new GoogleSpreadsheet(sskey);
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    let account = await promisify(sheet.getRows)({
        query: `discordid = ${message.author.id}`
    });
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //slices the prefix off and splits everything else into an array
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'flip') {
        let account = accessSpreadsheet();
        if (account.balance < args[0]) {
            message.channel.send(`You don't have that much money, ${message.author}!`);
            return;
        }

        const choice = args.shift().toLowerCase();
        let result = Math.floor(Math.random() * 10);
        let outcome = result >= 5 ? 'heads' : 'tails';

        if (choice === outcome) {
            account.balance += args[0] * 2;
            //account.save();
            message.channel.send(`You win! :tada: Your new balance is: ${account.balance}`);
        } else {
            account.balance -= args[0];
            //account.save();
            message.channel.send(`You lose. :weary: Your new balance is: ${account.balance}`);
        }
    }
});

client.login(token);