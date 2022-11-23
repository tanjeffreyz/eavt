import home from './home.svg';
import backChevron from './back-chevron.svg';
import chevronLeft from './chevron-left.svg';
import chevronRight from './chevron-right.svg';
import play from './play.svg';
import pause from './pause.svg';

function getIcon(src) {
  function Icon(props) {
    let { 
      width=20, 
      height=20
    } = props;
    return <img src={src} width={width} height={height} alt={src} {...props} />;
  }
  return Icon;
}


const Home = getIcon(home);
const Back = getIcon(backChevron);
const ChevronLeft = getIcon(chevronLeft);
const ChevronRight = getIcon(chevronRight);
const Play = getIcon(play);
const Pause = getIcon(pause);

export {
  Home,
  Back,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
};
