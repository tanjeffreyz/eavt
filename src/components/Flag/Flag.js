import { Dropdown } from 'react-bootstrap';
import { sendRequest } from '../../utils';
import { Flag as FlagIcon } from '../Icons/Icons';
import './Flag.css';

const SYMBOLS = {
  'none': null,
  'star': '⭐',
  'error': '❌'
};

function Flag({
  value
}) {
  return (
    <div title={value} className='flag'>
      {getFlagSymbol(value)}
    </div>
  );
}

function FlagSelector({
  value,
  uri,
  loadDocument,
  ...props
}) {
  const defaultFlag = <FlagIcon width={12} height={12} style={{fill: '#ced4da'}}/>;

  function setFlag(newValue) {
    if (newValue !== value && newValue in SYMBOLS) {
      sendRequest({
        uri,
        config: {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({flag: newValue})
        },
        pass: loadDocument
      });
    }
  }

  function getFlagOption(f, i) {
    return (
      <Dropdown.Item key={i} onClick={() => setFlag(f)}>
        <Flag value={f} /> {f}
      </Dropdown.Item>
    );
  }

  const options = Object.keys(SYMBOLS).map(getFlagOption);
  return (
    <Dropdown className='flag-inline'>
      <Dropdown.Toggle 
        variant='outline-primary' 
        size='sm'
        className={`${props.className} flag-dropdown-toggle`}
      >
        {(value === 'none') ? defaultFlag : <Flag value={value} />}
      </Dropdown.Toggle>
      <Dropdown.Menu className='flag-dropdown-menu'>
        {options}
      </Dropdown.Menu>
    </Dropdown>
  );
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
