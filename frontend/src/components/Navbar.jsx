import React from 'react';
import {NavLink} from 'react-router-dom';
import {assets} from '../assets/assets';
import Cookies from 'js-cookie';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Search, 
  DollarSign, 
  User, 
  LogOut,
  MessageCircle
} from 'lucide-react';

const Navbar = () => {
  const logout = async () => {
    try {
      Cookies.remove('token');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isAuthenticated = !!Cookies.get('token');

  const NavItem = ({ to, icon: Icon, label, onClick, func }) => (
    <NavLink 
      to={to} 
      onClick={onClick} 
      title={func}
      className={({ isActive }) => `
        flex flex-col items-center justify-center 
        w-full py-3 
        hover:bg-[#ff3399] 
        transition-colors duration-200 
        ${isActive ? 'bg-[#ff3399]' : ''}
      `}
    >
      <Icon size={24} strokeWidth={2} />
    </NavLink>
  );

  return (
    <div className='fixed top-0 left-0 h-screen w-20 bg-[#e60073] text-white 
      flex flex-col items-center justify-between py-5'>
      
      {/* Top Section */}
      <div className='flex flex-col items-center w-full'>
        <NavLink to='/' className='mb-8 flex items-center justify-center w-full'>
          <img 
            src={assets.logo} 
            className='h-14 w-14 object-contain' 
            alt="logo" 
            func="Home"
          />
        </NavLink>
        
        <div className='flex flex-col items-center w-full space-y-2'>
          <NavItem to='/buy' icon={Search} label="Search" func="Search Item"/>
          <NavItem to='/sell' icon={DollarSign} label="Sell" func="Sell Item"/>
          <NavItem to='/cart' icon={ShoppingCart} label="Cart" func="Cart"/>
          <NavItem to='/orders' icon={Package} label="Order" func="Order History"/>
          <NavItem to='/deliver' icon={Truck} label="Deliver" func="Deliver Items"/>
          <NavItem to='/chat' icon={MessageCircle} label="Chat" func="Chat"/>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className='flex flex-col items-center w-full'>
        {isAuthenticated ? (
          <>
            <NavItem to='/profile' icon={User} label="Profile" func="Profile"/>
            <div 
              onClick={logout} 
              className='flex flex-col items-center w-full py-3 
                hover:bg-[#ff3399] cursor-pointer transition-colors duration-200'
            >
              <LogOut size={24} strokeWidth={2} />
            </div>
          </>
        ) : (
          <>
            <NavItem 
              to='/login' 
              icon={() => (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
              )}
              label="Login"
              func="Login"
            />
            <NavItem 
              to='/register' 
              icon={() => (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
              label="Register"
              func="Register"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;