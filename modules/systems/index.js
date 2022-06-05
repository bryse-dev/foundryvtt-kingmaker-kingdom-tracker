import DND5E from "./dnd5e.js";
import BitD from "./blades-in-the-dark.js";

const SUPPORTED_SYSTEMS = {
  "blades-in-the-dark": BitD,
  "dnd5e": DND5E
};

const defaultLoadKingdomFromActor = ({ actor }) => {
  return {
    progress: actor.getFlag("kingmaker-kingdom-tracker", "progress"),
    size: actor.getFlag("kingmaker-kingdom-tracker", "size"),
    theme: actor.getFlag("kingmaker-kingdom-tracker", "theme")
  };
};

const defaultPersistKingdomToActor = async ({ kingdom }) => {
  return {
    flags: {
      kingdoms: {
        progress: kingdom.progress,
        size: kingdom.size,
        theme: kingdom.theme
      }
    }
  };
};

export const getSystemMapping = (id) => {
  const defaultSystemConfig = {
    loadKingdomFromActor: defaultLoadKingdomFromActor,
    persistKingdomToActor: defaultPersistKingdomToActor
  };

  if (!SUPPORTED_SYSTEMS[id]) {
    return {
      id,
      ...defaultSystemConfig,
      registerSheetOptions: {
        types: game.data.system.template.Actor.types
      }
    };
  }

  return {
    id,
    ...defaultSystemConfig,
    ...SUPPORTED_SYSTEMS[id]
  };
};