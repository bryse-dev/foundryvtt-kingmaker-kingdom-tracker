import { KingdomConfig } from "./config.js";
import { log } from "./util.js";

const nextIndexInArray = (arr, el) => {
  const idx = arr.indexOf(el);
  return (idx < 0 || idx >= arr.length) ? 0 : idx + 1;
}

export class Kingdom {
  static get sizes () {
    return [4, 6, 8, 12];
  }

  constructor ({ governmentType, size, progress } = {}) {
    let config = new KingdomConfig()
    this._config = config
    const isSupportedSize = size && Kingdom.sizes.indexOf(parseInt(size)) >= 0;
    this._size = isSupportedSize ? parseInt(size) : Kingdom.sizes[0];

    const p = (!progress || progress < 0) ? 0 : progress < this._size ? progress : this._size;
    this._progress = p || 0;

    this._governmentType = governmentType ||  KingdomConfig.governmentTypes[0];
  }

  static get governmentTypes () {
    return KingdomConfig.governmentTypes
  }
  static get controlDC () {
    return KingdomConfig.controlDC
  }
  static get leadershipRoles () {
    return KingdomConfig.leadershipRoles()
  }

  get governmentType () {
    return this._governmentType;
  }

  get size () {
    return this._size;
  }

  get progress () {
    return this._progress;
  }

  get image () {
    return { 
      img: `/modules/kingmaker-kingdom-tracker/images/kingdom.png`,
      width: 350,
      height: 350
    };
  }

  get flags () {
    return {
      kingdoms: {
        governmentType: this._governmentType,
        size: this._size,
        progress: this._progress
      }
    };
  }

  // cycleSize () {
  //   return new Kingdom({
  //     governmentType: this.governmentType,
  //     size: Kingdom.sizes[nextIndexInArray(Kingdom.sizes, this.size)],
  //     progress: this.progress
  //   });
  // }
  //
  // cycleTheme () {
  //   return new Kingdom({
  //     governmentType: Kingdom.governmentTypes[nextIndexInArray(Kingdom.governmentTypes, this.governmentType)],
  //     size: this.size,
  //     progress: this.progress
  //   });
  // }
  //
  // increment () {
  //   const old = this;
  //   return new Kingdom({
  //     governmentType: old.governmentType,
  //     size: old.size,
  //     progress: old.progress + 1
  //   });
  // }
  //
  // decrement () {
  //   const old = this;
  //   return new Kingdom({
  //     governmentType: old.governmentType,
  //     size: old.size,
  //     progress: old.progress - 1
  //   });
  // }

  isEqual (kingdom) {
    return kingdom
      && kingdom._progress === this._progress
      && kingdom._size === this._size
      && kingdom._governmentType === this._governmentType;
  }

  toString () {
    return `${this._progress}/${this._size} • ${this._governmentType}`;
  }
}