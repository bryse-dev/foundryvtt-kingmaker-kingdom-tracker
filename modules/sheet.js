import { Kingdom } from "./kingdom.js";
import { getSystemMapping } from "./systems/index.js";
import { log, warn } from "./util.js";

const DISPLAY_NAME = {
  ALWAYS_FOR_EVERYONE: 50
};
const DISPOSITION = {
  NEUTRAL: 0
};
const DEFAULT_TOKEN = {
  scale: 1,
  disposition: DISPOSITION.NEUTRAL,
  displayName: DISPLAY_NAME.ALWAYS_FOR_EVERYONE,
  actorLink: true
};

export class KingdomSheet extends ActorSheet {
  static get defaultOptions() {
    const supportedSystem = getSystemMapping(game.data.system.id);
	  return mergeObject(
      super.defaultOptions,
      {
        classes: ["kingdoms", "sheet", `kingdoms-system-${game.data.system.id}`, "actor", "npc"],
        template: "/modules/kingmaker-kingdom-tracker/templates/sheet.html",
        width: 350,
        height: 525,
        ...supportedSystem.sheetDefaultOptions
      }
    );
  }

  static register () {
    const supportedSystem = getSystemMapping(game.data.system.id);
    Actors.registerSheet(supportedSystem.id, KingdomSheet, supportedSystem.registerSheetOptions);
    log("Sheet Registered");
  }

  constructor (...args) {
    super(...args);
    this._system = getSystemMapping(game.data.system.id);
  }

  get system () {
    return this._system;
  }

  getData () {
    const kingdom = new Kingdom(this.system.loadKingdomFromActor({ actor: this.actor }));
    return mergeObject(super.getData(), {
      kingdom: {
        progress: kingdom.progress,
        size: kingdom.size,
        governmentType: kingdom.governmentType,
        image: {
          url: kingdom.image.img,
          width: kingdom.image.width,
          height: kingdom.image.height
        },
        settings: {
          sizes: Kingdom.sizes,
          governmentTypes: Kingdom.governmentTypes
        }
      }
    });
  }

  activateListeners (html) {
    super.activateListeners(html);

    // html.find("button[name=minus]").click(async (ev) => {
    //   ev.preventDefault();
    //   const oldKingdom = new Kingdom(this.system.loadKingdomFromActor({ actor: this.actor }));
    //   this.updateKingdom(oldKingdom.decrement());
    // });
    //
    // html.find("button[name=plus]").click(async (ev) => {
    //   ev.preventDefault();
    //   const oldKingdom = new Kingdom(this.system.loadKingdomFromActor({ actor: this.actor }));
    //   this.updateKingdom(oldKingdom.increment());
    // });
    //
    // html.find("button[name=reset]").click(async (ev) => {
    //   ev.preventDefault();
    //   const oldKingdom = new Kingdom(this.system.loadKingdomFromActor({ actor: this.actor }));
    //   this.updateKingdom(new Kingdom({
    //     governmentType: oldKingdom.governmentType,
    //     progress: 0,
    //     size: oldKingdom.size
    //   }));
    // });
  }

  async _updateObject(_event, form) {
    await this.object.update({
      name: form.name
    });

    const oldKingdom = new Kingdom(this.system.loadKingdomFromActor({ actor: this.actor }));
    let newKingdom = new Kingdom({
      progress: oldKingdom.progress,
      size: form.size,
      governmentType: form.governmentType
    });
    await this.updateKingdom(newKingdom);
  }

  async updateKingdom(kingdom) {
    const actor = this.actor;

    // update associated tokens
    const tokens = actor.getActiveTokens();
    for (const t of tokens) {
      await t.update({
        name: actor.name,
        img: kingdom.image.img,
        actorLink: true
      });
    }

    // update the Actor
    const persistObj = await this.system.persistKingdomToActor({ actor, kingdom });
    const visualObj = {
      img: kingdom.image.img,
      token: {
        img: kingdom.image.img,
        ...DEFAULT_TOKEN
      }
    };
    await actor.update(mergeObject(visualObj, persistObj));
  }
}
