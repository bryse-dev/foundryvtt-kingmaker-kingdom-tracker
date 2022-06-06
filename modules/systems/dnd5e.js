export default {
  registerSheetOptions: { types: ["npc"] },

  loadKingdomFromActor: ({ actor }) => {
    return {
      progress: actor.getFlag("kingmaker-kingdom-tracker", "progress"),
      size: actor.getFlag("kingmaker-kingdom-tracker", "size"),
      formOfGovernment: actor.getFlag("kingmaker-kingdom-tracker", "formOfGovernment")
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
          formOfGovernment: kingdom.formOfGovernment,
        }
      }
    };
  }
};
