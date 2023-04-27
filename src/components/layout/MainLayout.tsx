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

let leftOpen = layout ? 'open' : 'closed';

 return <>
  {/* <div onClick={() => changeLayout()} className='sidebar__menu__item__icon'>
    <i className='bx bx-menu'></i>
  </div>
 <div className={`${ layout ? 'layout-on' : 'layout-off'}`}>
    {  layout && <Sidebar layout={layout} updateLayout={updateLayout} />}
    
    <Outlet/>
  </div> */}
    <div id='layout'>

      <div id='left' className={leftOpen} >
        <div className={`sidebar ${leftOpen}`} >
          <div className='sidebar-container'>
            {  layout && <Sidebar layout={layout} updateLayout={updateLayout} />}
          </div>
        </div>
      </div>

      <div id='main'>
        <div className='header'  onClick={() =>  layout && setLayout(false)}>
            <div className='icon'
                onClick={() => changeLayout()} >
                &equiv;
            </div>
            <h3 className={`
                title
                ${'left-' + leftOpen}
            `}>
                Diabetico
            </h3>
        </div>
        <div className='content'  onClick={() => layout && setLayout(false)}>
          <Outlet/>
        </div>
    </div>
  </div>
  </>
};

export default MainLayout;
