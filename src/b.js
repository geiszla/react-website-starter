function (rule, styleSheet) {
  ruleCounter += 1;
   true ? (0, _warning.default)(ruleCounter < 1e10, ['Material-UI: you might have a memory leak.', 'The ruleCounter is not supposed to grow that much.'].join('')) : undefined; // Code branch the whole block at the expense of more code.

  if (dangerouslyUseGlobalCSS) {
    if (styleSheet) {
      if (styleSheet.options.name) {
        return "".concat(styleSheet.options.name, "-").concat(rule.key);
      }

      if (styleSheet.options.classNamePrefix && "development" !== 'production') {
        var prefix = safePrefix(styleSheet.options.classNamePrefix);
        return "".concat(prefix, "-").concat(rule.key, "-").concat(seed).concat(ruleCounter);
      }
    }

    if (false) {}

    return "".concat(rule.key, "-").concat(seed).concat(ruleCounter);
  }

  if (false) {}

  if (styleSheet && styleSheet.options.classNamePrefix) {
    var _prefix = safePrefix(styleSheet.options.classNamePrefix);

    return "".concat(_prefix, "-").concat(rule.key, "-").concat(seed).concat(ruleCounter);
  }

  return "".concat(rule.key, "-").concat(seed).concat(ruleCounter);
}