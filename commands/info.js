const Discord = require('discord.js')                           // Imports discord

module.exports = {
    name: 'info',
    description: 'Returns how much time has passed since the user joined!',
    async execute(message, args, client) {
        if (message.channel.type === "dm") return;
        // Make sure this command was only executed in #support-bot
        //if (message.channel.name !== "support-bot") return;
        // Delete message if role gets pinged
        if (message.mentions.roles.find(role => role.name === "Admin") != null || message.mentions.roles.find(role => role.name === "Dev") != null) {
            await message.author.send("We don't ping admins or devs for that....");
            message.delete();
            return;
        }

        let member = message.mentions.members.first() != null ? message.mentions.members.first() : message.member
        let joined = member.joinedAt;
        let created = member.user.createdAt;
        
        // TODO: Format the date. There is a resource in the guide on how to format it.
        joinedArray = joined.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ');
        joinedN = joinedArray[0].split('-');
        joinedDay = joinedN[2] == '01' ? '1st' : joinedN[2] == '02' ? '2nd' : joinedN[2] == '03' ? '3rd' : joinedN[2] + 'th';
        days = Math.round((new Date() - joined) / 1000 / 60 / 60 / 24);

        daysSinceCreated = Math.round((new Date() - created) / 1000 / 60 / 60 / 24);
        createdString = '';
        if (daysSinceCreated < 365) {
            createdString = `${daysSinceCreated} days`;
        } else {
            weirdThing = daysSinceCreated / 365 + '';
            years = 1 * parseInt(weirdThing.substr(0, weirdThing.indexOf('.')));
            createdString = `${years} ${years == 1 ? 'year' : 'years'} and ${daysSinceCreated - (years * 365)} days`;
        }

        rolesString = '';
        member.roles.cache.forEach(role => {
            if (role.name !== '@everyone') {
                rolesString += `<@&${role.id}> `;
            }
        })
        // Create sexy embed!
        let embedMentioned = {
            color: 0x00ffff,
            title: (member.displayName) + ' - ' + getStatus(member.presence.status), // Maybe also check if on phone
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
            fields: [
                {
                    name: 'Joined: ',
                    value: joinedDay.replace('0', '') + ' of ' + getMonth(joinedN[1]) + ' ' + joinedN[0]
                },
                {
                    name: 'Premium',
                    value: member.premiumSince != null ? 'Yep' : 'Nope'
                },
                {
                    name: 'Roles',
                    value: rolesString.replace('<&@everyone>', '')
                },
                {
                    name: 'Avatar',
                    value: `[Click to open](${member.user.displayAvatarURL()})`
                },
                {
                    name: 'Did you know...',
                    value: `...that already ${days} days have passed since the member joined?\n...that the member uses Discord for ${createdString} now?`
                },
            ],
            footer: {
                text: 'Time is relative, as always.'
            }
        }
        message.channel.send({
            embed: embedMentioned
        });
    }
}

function getMonth(month) {
    switch (month) {
        case '01':
            return 'January';
        case '02':
            return 'February';
        case '03':
            return 'March';
        case '04':
            return 'April';
        case '05':
            return 'May';
        case '06':
            return 'June';
        case '07':
            return 'July';
        case '08':
            return 'August';
        case '09':
            return 'September';
        case '10':
            return 'October';
        case '11':
            return 'November';
        case '12':
            return 'December';
    }
}

function getStatus(status) {
    switch (status) {
        case 'online':
            return 'Online';
        case 'idle':
            return 'AFK';
        case 'offline':
            return 'Offline';
        case 'dnd':
            return 'Do Not Disturb';
        default:
            return 'Status not available';
    }
}