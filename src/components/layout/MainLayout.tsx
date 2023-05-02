import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import "./MainLayout.scss"
import { useState } from 'react';

const MainLayout: React.FC = () => {

  const [layout, setLayout] = useState<boolean>(false)

  const changeLayout = (()=> {
    setLayout(!layout)
  })

  const updateLayout = (layoutResult: boolean):void => {
    setLayout(layoutResult)
}

 return <>
  <div onClick={() => changeLayout()} className='sidebar__menu__item__icon'>
    <i className='bx bx-menu'></i>
  </div>
 <div className={`${ layout ? 'layout-on' : 'layout-off'}`}>
    {  layout && <Sidebar layout={layout} updateLayout={updateLayout} />}
    
    <Outlet/>
  </div>
  </>
};

export default MainLayout;
