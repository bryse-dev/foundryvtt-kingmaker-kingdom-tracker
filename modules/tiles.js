import { Kingdom } from "./kingdom.js";
import { log, error } from "./util.js";

const onClick = async () => {
  log('Tool Clicked');
  const kingdom = new Kingdom();
  const dim = {
    x: ((canvas.dimensions.sceneRect.width - kingdom.image.width) / 2) + canvas.dimensions.paddingX,
    y: ((canvas.dimensions.sceneRect.height - kingdom.image.height) / 2) + canvas.dimensions.paddingY
  };

  const tile = new Tile({
    img: kingdom.image.img,
    width: kingdom.image.width,
    height: kingdom.image.height,
    x: dim.x,
    y: dim.y,
    z: 900,
    rotation: 0,
    hidden: false,
    locked: false,
    flags: kingdom.flags
  });
  canvas.scene.createEmbeddedEntity('Tile', tile.data);
};

export default {
  getSceneControlButtons: (controls) => {
    const tiles = controls.find((c) => c.name === "tiles");
    tiles.tools.push({
      name: "kingdoms",
      title: "Kingdoms",
      icon: "fas fa-kingdom",
      onClick,
      button: true
    });
  },

  renderTileHUD: async (_hud, html, tile) => {
    log("Render")
    let t = canvas.tiles.get(tile._id);
    if (!t.data.flags.kingdoms) {
      return;
    }

    const buttonHTML = await renderTemplate('/modules/kingmaker-kingdom-tracker/templates/buttons.html');
    html.find("div.left").append(buttonHTML).click(async (event) => {
      log("HUD Clicked")
      // re-get in case there has been an update
      t = canvas.tiles.get(tile._id);

      const oldKingdom = new Kingdom(t.data.flags.kingdoms);
      let newKingdom;

      const target = event.target.classList.contains("control-icon")
        ? event.target
        : event.target.parentElement;
      if (target.classList.contains("cycle-size")) {
        newKingdom = oldKingdom.cycleSize();
      } else if (target.classList.contains("cycle-governmentType")) {
        newKingdom = oldKingdom.cycleTheme();
      } else if (target.classList.contains("progress-up")) {
        newKingdom = oldKingdom.increment();
      } else if (target.classList.contains("progress-down")) {
        newKingdom = oldKingdom.decrement();
      } else {
        return error("ERROR: Unknown TileHUD Button");
      }

      await t.update({
        img: newKingdom.image.img,
        flags: newKingdom.flags
      });
    });
  }
};