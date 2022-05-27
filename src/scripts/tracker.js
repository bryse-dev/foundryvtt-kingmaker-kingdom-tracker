
Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(ToDoList.ID);
});

console.log('KKT Initialization');

class Kingdom {
    static ID = 'kingmaker-kingdom-tracker';
    static ACTORNAME = 'KKT Kingdom'

    static FLAGS = {
        Name: 'name',
        Alignment: 'alignment',
        Size: 'size',
        ControlDC: 'controldc',
        Population: 'population',
        Stability: 'stability',
        Economy: 'economy',
        Loyalty: 'loyalty',
        Unrest: 'unrest',
        Treasury: 'treasury',
        Consumption: 'consumption',
        Leadership: 'leadership',
        Edicts: 'edicts',

        Cities: 'cities',
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

        //TODO: get this to populate a starting actor

        if (game.actors.getName(Kingdom.ACTORNAME) == null) {
            let actor = Actor.create({name: Kingdom.ACTORNAME, type: "npc"})
            this.ID = actor.id
        }

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

    static getKingdomAttribute(flag) {
        return game.actors.getName(Kingdom.ACTORNAME).getFlag(Kingdom.ID, flag);
    }

    static setKingdomAttribute(flag, newValue) {
        return game.actors.getName(Kingdom.ACTORNAME).setFlag(Kingdom.ID, flag, newValue);
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
            name: KingdomData.getKingdomAttribute(Kingdom.FLAGS.Name),
            note: "Add more getters here if this is useful"
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData);
        Kingdom.log("What is this" + formData);
        // await KingdomData.updateUserToDos(this.options.userId, expandedData);

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
                //await KingdomData.createToDo(this.options.userId);
                this.render();
                break;
            }

            case 'delete': {
                // const confirmed = await Dialog.confirm({
                //     title: game.i18n.localize("Kingdom.confirms.deleteConfirm.Title"),
                //     content: game.i18n.localize("Kingdom.confirms.deleteConfirm.Content")
                // });
                //
                // if (confirmed) {
                //     await KingdomData.deleteToDo(toDoId);
                //     this.render();
                // }
                //
                break;
            }

            default:
                Kingdom.log(false, 'Invalid action detected', action);
        }
    }
}