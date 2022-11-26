const SYMBOLS = {
  'star': '⭐',
  'error': '❌'
};

function Flag({
  value
}) {
  return (
    <div title={value}>{getFlagSymbol(value)}</div>
  );
}

function FlagSelector({
  defaultValue,
  uri
}) {
  
}

function getFlagSymbol(value) {
  if (value in SYMBOLS) {
    return SYMBOLS[value];
  }
  return null;
}

export {
  Flag,
  FlagSelector
};
