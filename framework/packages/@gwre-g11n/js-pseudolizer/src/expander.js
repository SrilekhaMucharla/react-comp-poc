expander = function() {


  expanderOut = {

    PADDING_DELIMITER : ":::",

    EMOJI_PADDING_CHARS : ["🐔", "🏆", "🤙", "🤯", "🎆"],

    PADDING_CHARS : ["𠜎", "𠜱", "𠲖", "𠴕", "𢺳", "𠸏",
      "дд", "ςς", "ते", "жж", "க்",
      "లో", "юю", "ြြ", "ਲੋ", "ਹੈ", "թթ", "তা"],

    addPadding: function (str) {
      let paddedStr = str + this.PADDING_DELIMITER;
      let ratio = 0.3;
      if (str.length <= 10){
        ratio = 1;
      } else if(str.length > 10 && str.length <= 20){
        ratio = 0.5;
      }

      let paddingLength = Math.max(Math.round(str.length * ratio) - 3, 2); // minimum 1 character
      const randIndex = Math.floor(Math.random() * this.EMOJI_PADDING_CHARS.length);
      paddedStr += this.EMOJI_PADDING_CHARS[randIndex];
      paddingLength -= 2;
      let allChars = getAllChars();
      while (paddingLength > 0) {
        const randIndex = Math.floor(Math.random() * allChars.length);
        paddedStr += allChars[randIndex];
        paddingLength -= allChars[randIndex].length;
      }
      return paddedStr;
    },

  };

  function getAllChars() {
    return expanderOut.EMOJI_PADDING_CHARS.concat(expanderOut.PADDING_CHARS);
  }

  return expanderOut;
}();

module.exports = expander;