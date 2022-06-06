export default {
  registerSheetOptions: { types: ["npc"] },

  loadKingdomFromActor: ({ actor }) => {
    return {
      progress: actor.getFlag("kingmaker-kingdom-tracker", "progress"),
      size: actor.getFlag("kingmaker-kingdom-tracker", "size"),
      governmentType: actor.getFlag("kingmaker-kingdom-tracker", "governmentType")
    };
  },

  persistKingdomToActor: ({ kingdom }) => {
    return {
      data: {
        attributes: {
          hp: {
            value: kingdom.progress,
            max: kingdom.size
          }
        }
      },
      flags: {
        kingdoms: {
          progress: kingdom.progress,
          size: kingdom.size,
          governmentType: kingdom.governmentType,
        }
      }
    };
  }
};
