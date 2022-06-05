const nextIndexInArray = (arr, el) => {
  const idx = arr.indexOf(el);
  return (idx < 0 || idx >= arr.length) ? 0 : idx + 1;
}

export class Kingdom {
  static get sizes () {
    return [4, 6, 8, 12];
  }

  static get themes () {
    return ["dog_blink_blue", "dog_blink_yellow"];
  }

  constructor ({ theme, size, progress } = {}) {
    const isSupportedSize = size && Kingdom.sizes.indexOf(parseInt(size)) >= 0;
    this._size = isSupportedSize ? parseInt(size) : Kingdom.sizes[0];

    const p = (!progress || progress < 0) ? 0 : progress < this._size ? progress : this._size;
    this._progress = p || 0;

    this._theme = theme || Kingdom.themes[0];
  }

  get theme () {
    return this._theme;
  }

  get size () {
    return this._size;
  }

  get progress () {
    return this._progress;
  }

  get image () {
    return { 
      img: `/modules/kingmaker-kingdom-tracker/themes/kingdom.png`,
      width: 350,
      height: 350
    };
  }

  get flags () {
    return {
      kingdoms: {
        theme: this._theme,
        size: this._size,
        progress: this._progress
      }
    };
  }

  cycleSize () {
    return new Kingdom({
      theme: this.theme,
      size: Kingdom.sizes[nextIndexInArray(Kingdom.sizes, this.size)],
      progress: this.progress
    });
  }

  cycleTheme () {
    return new Kingdom({
      theme: Kingdom.themes[nextIndexInArray(Kingdom.themes, this.theme)],
      size: this.size,
      progress: this.progress
    });
  }

  increment () {
    const old = this;
    return new Kingdom({
      theme: old.theme,
      size: old.size,
      progress: old.progress + 1
    });
  }

  decrement () {
    const old = this;
    return new Kingdom({
      theme: old.theme,
      size: old.size,
      progress: old.progress - 1
    });
  }

  isEqual (kingdom) {
    return kingdom
      && kingdom._progress === this._progress
      && kingdom._size === this._size
      && kingdom._theme === this._theme;
  }

  toString () {
    return `${this._progress}/${this._size} • ${this._theme}`;
  }
}