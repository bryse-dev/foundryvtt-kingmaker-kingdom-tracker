
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(ToDoList.ID);
});

console.log('KKT Initialization');

class Kingdom {
    static ID = 'kingmaker-kingdom-tracker';

    static FLAGS = {
        TODOS: 'todos'
    }

    static SETTINGS = {
        INJECT_BUTTON: 'inject-button'
    }

    static TEMPLATES = {
        CITYLIST: `modules/${this.ID}/templates/tracker.hbs`
    }

    static log(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    static initialize() {
        this.KingdomConfig = new KingdomConfig();

        game.settings.register(this.ID, this.SETTINGS.INJECT_BUTTON, {
            name: `Kingdom.settings.${this.SETTINGS.INJECT_BUTTON}.Name`,
            default: true,
            type: Boolean,
            scope: 'client',
            config: true,
            hint: `Kingdom.settings.${this.SETTINGS.INJECT_BUTTON}.Hint`,
            onChange: () => ui.players.render()
        });
    }
}

Hooks.once('init', () => {
    Kingdom.initialize();
});

class KingdomData {

    static getToDosForUser(userId) {
        return game.users.get(userId)?.getFlag(Kingdom.ID, Kingdom.FLAGS.TODOS);
    }

    static createToDo(userId, toDoData) {
        // generate a random id for this new ToDo and populate the userId
        const newToDo = {
            isDone: false,
            ...toDoData,
            id: foundry.utils.randomID(16),
            userId,
        }

        // construct the update to insert the new ToDo
        const newToDos = {
            [newToDo.id]: newToDo
        }

        // update the database with the new ToDos
        return game.users.get(userId)?.setFlag(Kingdom.ID, Kingdom.FLAGS.TODOS, newToDos);
    }

    static get allToDos() {
        const allToDos = game.users.reduce((accumulator, user) => {
            const userTodos = this.getToDosForUser(user.id);

            return {
                ...accumulator,
                ...userTodos
            }
        }, {});

        return allToDos;
    }

    static updateToDo(toDoId, updateData) {
        const relevantToDo = this.allToDos[toDoId];

        // construct the update to send
        const update = {
            [toDoId]: updateData
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(Kingdom.ID, Kingdom.FLAGS.TODOS, update);
    }

    static deleteToDo(toDoId) {
        const relevantToDo = this.allToDos[toDoId];

        // Foundry specific syntax required to delete a key from a persisted object in the database
        const keyDeletion = {
            [`-=${toDoId}`]: null
        }

        // update the database with the updated ToDo list
        return game.users.get(relevantToDo.userId)?.setFlag(Kingdom.ID, Kingdom.FLAGS.TODOS, keyDeletion);
    }

    static updateUserToDos(userId, updateData) {
        return game.users.get(userId)?.setFlag(Kingdom.ID, Kingdom.FLAGS.TODOS, updateData);
    }
}

Hooks.on('renderPlayerList', (playerList, html) => {

    if (!game.settings.get(Kingdom.ID, Kingdom.SETTINGS.INJECT_BUTTON)) {
        return;
    }

    // find the element which has our logged in user's id
    const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`)

    // create localized tooltip
    const tooltip = game.i18n.localize('Kingdom.button-title');

    // insert a button at the end of this element
    loggedInUserListItem.append(
        `<button type='button' class='todo-list-icon-button flex0' title='${tooltip}'><i class='fas fa-tasks'></i></button>`
    );

    // register an event listener for this button
    html.on('click', '.todo-list-icon-button', (event) => {
        const userId = $(event.currentTarget).parents('[data-user-id]')?.data()?.userId;

        Kingdom.KingdomConfig.render(true, {userId});
    });
});

class KingdomConfig extends FormApplication {

    static get defaultOptions() {
        const defaults = super.defaultOptions;

        const overrides = {
            height: 'auto',
            id: 'kingmaker-kingdom-tracker',
            template: Kingdom.TEMPLATES.CITYLIST,
            title: 'Kingdom',
            userId: game.userId,
            closeOnSubmit: false, // do not close when submitted
            submitOnChange: true, // submit when any input changes
        };

        const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

        return mergedOptions;
    }

    getData(options) {
        return {
            todos: KingdomData.getToDosForUser(options.userId)
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData);

        await KingdomData.updateUserToDos(this.options.userId, expandedData);

        this.render();
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', "[data-action]", this._handleButtonClick.bind(this));

    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget);
        const action = clickedElement.data().action;
        const toDoId = clickedElement.parents('[data-todo-id]')?.data()?.todoId;

        //Kingdom.log(false, 'Button Clicked!', { this: this, action, toDoId});

        switch (action) {
            case 'create': {
                await KingdomData.createToDo(this.options.userId);
                this.render();
                break;
            }

            case 'delete': {
                const confirmed = await Dialog.confirm({
                    title: game.i18n.localize("Kingdom.confirms.deleteConfirm.Title"),
                    content: game.i18n.localize("Kingdom.confirms.deleteConfirm.Content")
                });

                if (confirmed) {
                    await KingdomData.deleteToDo(toDoId);
                    this.render();
                }

                break;
            }

            default:
                Kingdom.log(false, 'Invalid action detected', action);
        }
    }
}