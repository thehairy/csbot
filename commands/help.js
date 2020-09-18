module.exports = {
	name: 'help',
	description: 'Help me!',
	execute(message, args, Client) {
		message.channel.send('I sent the dudes!');
	},
};