import { ReactComponent as home } from './home.svg';
import { ReactComponent as backChevron } from './back-chevron.svg';
import { ReactComponent as chevronLeft } from './chevron-left.svg';
import { ReactComponent as chevronRight } from './chevron-right.svg';
import { ReactComponent as play } from './play.svg';
import { ReactComponent as pause } from './pause.svg';
import { ReactComponent as crosshair } from './crosshair.svg';
import { ReactComponent as trashCan } from './trash-can.svg';

function getIcon(Source) {
  function Icon({ 
    width=20, 
    height=20,
    onClick,
    ...props
  }) {
    return (
      <div
        width={width} 
        height={height}
        onClick={onClick}
        {...props} 
        style={{...props.style, cursor: 'pointer', display: 'inline-block'}}
      >
        <Source width={width} height={height} {...props} />
      </div>
    );
  }
  return Icon;
}


const Home = getIcon(home);
const Back = getIcon(backChevron);
const ChevronLeft = getIcon(chevronLeft);
const ChevronRight = getIcon(chevronRight);
const Play = getIcon(play);
const Pause = getIcon(pause);
const Crosshair = getIcon(crosshair);
const TrashCan = getIcon(trashCan);

export {
  Home,
  Back,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Crosshair,
  TrashCan
};
