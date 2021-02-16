exports.smartTrim = (str, length, delim, appendix) => {
  if (str.length <= length) return str;

  let trimmedString = str.substring(0, length + delim.length);
  let lastDelimIndex = trimmedString.lastIndexOf(delim);
  if (lastDelimIndex >= 0)
    trimmedString = trimmedString.substring(0, lastDelimIndex);

  if (trimmedString) trimmedString += appendix;

  return trimmedString;
};
