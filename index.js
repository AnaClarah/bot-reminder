const Discord = require('discord.js');
const client = new Discord.Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

client.on('ready', () => {
	console.log('Logado')
	checkTimers();
});
function checkTimers() {
	setInterval(function() {
		let data = db.get('users').value()
		console.log(data)
		data.forEach(element => {
			console.log(element)
			if(element.time+2592000000 < Date.now()) {
				client.users.get(element.id).send('o que vai ser avisado em 30 dias');
				db.get('users').remove({id: element.id}).write();

			}
		})
	}, 15000)
}

client.on('message', msg => {
	if(msg.content.startsWith('!comando-setar')) {
		let data = db.get('users')
			.find({ id: msg.author.id })
			.value();
		if(typeof data == 'undefined'){
			db.get('users')
			.push({ id: msg.author.id, time: Date.now()})
			.write()		
		}
		msg.reply('vou falar algo em 30 dias');
	}
	
});

client.login('token');
