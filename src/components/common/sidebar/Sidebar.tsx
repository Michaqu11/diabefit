import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { ReactElement } from 'react';

import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import HomeIcon from '@mui/icons-material/Home';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

interface IChildProps {
    toggleDrawer: (arg: boolean) =>void
}

interface ISidebarNav {
    display: string,
    icon: ReactElement,
    to:string,
    section: string
  }

  
  const sidebarNavItems:ISidebarNav[] = [
    {
        display: 'Home',
        icon: <HomeIcon />,
        to: '/',
        section: '',
    },
    {
        display: 'New Entry',
        icon: <BloodtypeIcon />,
        to: '/entry',
        section: 'entry'
    },
    {
        display: 'New Bolus',
        icon: <VaccinesIcon />,
        to: '/bolus',
        section: 'bolus'
    },
    {
        display: 'New Product',
        icon: <AddShoppingCartIcon />,
        to: '/product',
        section: 'product'
    },
    {
        display: 'Setting',
        icon: <SettingsIcon />,
        to: '/setting',
        section: 'setting'
    },
  ]


const Sidebar: React.FC<IChildProps> = ({toggleDrawer}) => (
    <Box
        sx={{ width: 250 }}
        onKeyDown={() => toggleDrawer(false)}
    >

        <List>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>D</Avatar>
                    </ListItemIcon>
                    <ListItemText primary="User User" />
                </ListItemButton>
            </ListItem>

            <Divider sx={{paddingBottom: '5px', paddingTop: '5px'}}/>



            {sidebarNavItems.map((item, index) => (
            <Link to={item.to} key={index}>
                <ListItem disablePadding sx={{paddingTop: '5px'}}> 
                    <ListItemButton>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.display} />
                    </ListItemButton>
                </ListItem>
            </Link>
        ))}
        </List>
    </Box>
    );

export default Sidebar;
