import './Sidebar.scss'
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


interface ISidebarNav {
  display: string,
  icon: ReactElement,
  to:string,
  section: string
}

const sidebarNavItems:ISidebarNav[] = [
  {
      display: 'Home',
      icon: <i className='bx bx-home'></i>,
      to: '/',
      section: ''
  },
  {
      display: 'New Entry',
      icon: <i className='bx bx-donate-blood'></i>,
      to: '/entry',
      section: 'entry'
  },
  {
      display: 'New Bolus',
      icon: <i className='bx bx-injection'></i>,
      to: '/bolus',
      section: 'bolus'
  },
  {
      display: 'New Product',
      icon: <i className='bx bx-lemon'></i>,
      to: '/product',
      section: 'product'
  },
  {
      display: 'Setting',
      icon: <i className='bx bx-cog'></i>,
      to: '/setting',
      section: 'setting'
  },
]

const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepHeight, setStepHeight] = useState(0);
  const sidebarRef = useRef<any>();
  const indicatorRef = useRef<any>();
  const location = useLocation();

  useEffect(() => {
      setTimeout(() => {
          const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
          indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
          setStepHeight(sidebarItem.clientHeight);
      }, 50);
  }, []);

  // change active index
  useEffect(() => {
      const curPath = window.location.pathname.split('/')[1];
      const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
      setActiveIndex(curPath.length === 0 ? 0 : activeItem);
  }, [location]);
  

  return <div className='sidebar'>
  <div ref={sidebarRef} className="sidebar__menu">
    
      <div
          ref={indicatorRef}
          className="sidebar__menu__indicator"
          style={{
              transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
          }}
      ></div>
      {
          sidebarNavItems.map((item, index) => (
              <Link to={item.to} key={index}>
                  <div className={`sidebar__menu__item ${activeIndex === index ? 'active' : ''}`}>
                      <div className="sidebar__menu__item__icon">
                          {item.icon}
                      </div>
                      <div className="sidebar__menu__item__text">
                          {item.display}
                      </div>
                  </div>
              </Link>
          ))
      }
  </div>
</div>;
};

export default Sidebar;
