import Color from "color";

// Monkey patch light / dark functions for `color` package
// to work with `react-native-paper`
Color.prototype.light = function() {
  return this.isLight();
};

Color.prototype.dark = function() {
  return this.isDark();
};

// redefine `color` to always just return a string
// when used inside template string
class _BetterColor {
  constructor(c) {
    this.c = Color(c);
  }

  toString() {
    return this.c.hsl().string();
  }

  adjust(ratio) {
    const newCol = this.isDark() ? this.c.lighten(ratio) : this.c.darken(ratio);
    return new _BetterColor(newCol);
  }

  intensity(ratio) {
    const newCol = this.isDark() ? this.c.darken(ratio) : this.c.lighten(ratio);
    return new _BetterColor(newCol);
  }
}

for (var x in Color.prototype) {
  if (!(x in Object.prototype)) {
    const func = Color.prototype[x];
    _BetterColor.prototype[x] = function() {
      const retVal = func.apply(this.c, arguments);
      if (retVal instanceof Color) {
        return new BetterColor(retVal);
      } else {
        return retVal;
      }
    };
  }
}

_BetterColor.prototype.toJSON = _BetterColor.prototype.toString;

const BetterColor = arg => new _BetterColor(arg);

export default BetterColor;
