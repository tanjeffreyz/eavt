import home from './home.svg';
import chevronLeft from './chevron-left.svg';

function getIcon(src) {
  function Icon({ 
    width='20px', 
    height='20px' 
  }) {
    return <img src={src} width={width} height={height} className='icon' />;
  }
  return Icon;
}


const Home = getIcon(home);
const Back = getIcon(chevronLeft);

export {
  Home,
  Back
};
