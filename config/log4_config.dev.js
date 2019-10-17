'use strict';

module.exports = {
  appenders: {
    "rule-console": {"type": "console"},
    "rule-error": {"type": "console"},
    "rule-res": {"type": "console"}
  },
  categories: {
    "default": {"appenders": ["rule-console"], "level": "all"},
    "rule-error": {"appenders": ['rule-error'],"level": "error"},
    "rule-res": {"appenders": ['rule-res'], "level": "info"}
  },
  replaceConsole: false
}
