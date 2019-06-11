const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');
const name = 'Sumi';

function printAccount(account) {
    console.log(`Username: ${account.username}`);
    console.log(`Balance: ${account.balance}`);
    console.log(`Discord ID: ${account.discordid}`);
    console.log('--------------');
}

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet('1sE5Sjy8QX414zgQbvTf2MD6huWqUsSUFKZGbTEDJM1k');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    
    const rows = await promisify(sheet.getRows)({
        query: `username = ${name}`
    });

    rows.forEach(row => {
        row.balance = parseInt(row.balance) + 10;
        row.save();
    })
    printAccount(row);
}

accessSpreadsheet();
