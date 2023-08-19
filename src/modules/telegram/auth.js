const path = require('path');
const fs = require('fs');

const sudoUsersPath = path.join(__dirname, '../../config/sudo.json');
const usersPath = path.join(__dirname, '../../config/users.json');

module.exports = {
    init: async function (app) {

        const functionsHelpers = { addSudoUser, addUser, removeSudoUser, removeUser, checkPermissions };
        const { sudoUsers, users } = await getUsers();

        let status = 'ok'
        if (sudoUsers.length === 0) status = 'init'

        return {
            status,
            sudoUsers,
            users,
            ...functionsHelpers
        }
    }
}

async function getUsers () {
    try {
        const sudoUsers = JSON.parse(fs.readFileSync(sudoUsersPath)) || [];
        const users = JSON.parse(fs.readFileSync(usersPath)) || [];

        return {
            status: 'ok',
            sudoUsers,
            users
        }
    } catch (error) {
        _writeCredentials(sudoUsersPath, []);
        _writeCredentials(usersPath, []);
        return {
            status: 'error',
            sudoUsers: [],
            users: []
        }
    }
}

async function addSudoUser (id) {
    const { sudoUsers } = await getUsers();
    sudoUsers.push(id);
    return await _writeCredentials(sudoUsersPath, sudoUsers);
}

async function addUser (id) {
    const { users } = await getUsers();
    users.push(id);
    return await _writeCredentials(usersPath, users);
}

async function removeSudoUser (id) {
    const { sudoUsers } = await getUsers();
    const index = sudoUsers.indexOf(id);
    sudoUsers.splice(index, 1);
    return await _writeCredentials(sudoUsersPath, sudoUsers);
}

async function removeUser (id) {
    const { users } = await getUsers();
    const index = users.indexOf(id);
    users.splice(index, 1);
    return await _writeCredentials(usersPath, users);
}

async function _writeCredentials (fileDir, content) {
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(path.dirname(fileDir), { recursive: true });
    }
    fs.writeFileSync(fileDir, JSON.stringify(content));
}


async function checkPermissions (ctx, next) {
    if (ctx.from.id) {
        const { sudoUsers, users } = await getUsers();

        if (sudoUsers.includes(ctx.from.id)) {
            ctx.state.isAdmin = true;
            return next(ctx);
        }

        if (users.includes(ctx.from.id)) {
            ctx.state.isAdmin = false;
            return next(ctx);
        }

        ctx.reply('You are not allowed to use this bot');
    }
}