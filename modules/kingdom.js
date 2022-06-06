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

  constructor ({ formOfGovernment, size, progress } = {}) {
    let config = new KingdomConfig()
    log("HERE: " + config.governmentTypes)
    this._config = config
    const isSupportedSize = size && Kingdom.sizes.indexOf(parseInt(size)) >= 0;
    this._size = isSupportedSize ? parseInt(size) : Kingdom.sizes[0];

    const p = (!progress || progress < 0) ? 0 : progress < this._size ? progress : this._size;
    this._progress = p || 0;

    this._formOfGovernment = formOfGovernment ||  KingdomConfig.governmentTypes[0];
  }

  static get formOfGovernments () {
    return KingdomConfig.governmentTypes()
  }

  get formOfGovernment () {
    return this._formOfGovernment;
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
        formOfGovernment: this._formOfGovernment,
        size: this._size,
        progress: this._progress
      }
    };
  }

  // cycleSize () {
  //   return new Kingdom({
  //     formOfGovernment: this.formOfGovernment,
  //     size: Kingdom.sizes[nextIndexInArray(Kingdom.sizes, this.size)],
  //     progress: this.progress
  //   });
  // }
  //
  // cycleTheme () {
  //   return new Kingdom({
  //     formOfGovernment: Kingdom.formOfGovernments[nextIndexInArray(Kingdom.formOfGovernments, this.formOfGovernment)],
  //     size: this.size,
  //     progress: this.progress
  //   });
  // }
  //
  // increment () {
  //   const old = this;
  //   return new Kingdom({
  //     formOfGovernment: old.formOfGovernment,
  //     size: old.size,
  //     progress: old.progress + 1
  //   });
  // }
  //
  // decrement () {
  //   const old = this;
  //   return new Kingdom({
  //     formOfGovernment: old.formOfGovernment,
  //     size: old.size,
  //     progress: old.progress - 1
  //   });
  // }

  isEqual (kingdom) {
    return kingdom
      && kingdom._progress === this._progress
      && kingdom._size === this._size
      && kingdom._formOfGovernment === this._formOfGovernment;
  }

  toString () {
    return `${this._progress}/${this._size} • ${this._formOfGovernment}`;
  }
}