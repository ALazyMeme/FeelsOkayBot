`use strict`;

function isUpperCase(str) {
    return str === str.toUpperCase();
  };
  
  function isLowerCase(str) {
    return str === str.toLowerCase();
  };

module.exports = {
    isUpperCase,
    isLowerCase,
};
