import home from './home.svg';
import chevronLeft from './chevron-left.svg';

function getIcon(src) {
  function Icon({ 
    width='20px', 
    height='20px' 
  }) {
    return <img src={src} width={width} height={height} alt={src} />;
  }
  return Icon;
}


const Home = getIcon(home);
const Back = getIcon(chevronLeft);

export {
  Home,
  Back
};
