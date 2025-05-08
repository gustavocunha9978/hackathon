import classNames from 'classnames';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ChildrenType } from '../../types/ReactChildren';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppTopbar } from './AppTopbar';

import { useAuth } from '../../context/AuthContext';
import '../../layout/lara-light-blue/theme.css';
import '../../layout/layout.scss';
import { localeTemplate } from '../../utils/localeTemplate';
import { menuItems } from '../authorization/menu';

function Layout({ children }: ChildrenType) {
  addLocale('br', localeTemplate);
  locale('br');

  const [layoutMode] = useState('static');
  const [inputStyle] = useState('outlined');
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);

  const { user } = useAuth();

  const layoutColorMode = 'light';
  const ripple = true;

  let menuClick = false;
  let mobileTopbarMenuClick = false;

  // add ou remove classe para esconder menu lateral no mobile.
  useEffect(() => {
    if (mobileMenuActive) {
      addClass(document.body, 'body-overflow-hidden');
    } else {
      removeClass(document.body, 'body-overflow-hidden');
    }
  }, [mobileMenuActive]);

  // captura clique na tela.
  const onWrapperClick = () => {
    if (!menuClick) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }

    if (!mobileTopbarMenuClick) {
      setMobileTopbarMenuActive(false);
    }

    mobileTopbarMenuClick = false;
    menuClick = false;
  };

  // esconde/exibe menu quando o botão hamburguer é clicado.
  const onToggleMenuClick = (event: any) => {
    menuClick = true;

    if (isDesktop()) {
      if (layoutMode === 'overlay') {
        if (mobileMenuActive === true) {
          setOverlayMenuActive(true);
        }

        setOverlayMenuActive(prevState => !prevState);
        setMobileMenuActive(false);
      } else if (layoutMode === 'static') {
        setStaticMenuInactive(prevState => !prevState);
      }
    } else {
      setMobileMenuActive(prevState => !prevState);
    }

    event.preventDefault();
  };

  // captura clique no menu lateral.
  const onSidebarClick = () => {
    menuClick = true;
  };

  // captura clique no menu da topbar/mobile.
  const onMobileTopbarMenuClick = (event: any) => {
    mobileTopbarMenuClick = true;

    setMobileTopbarMenuActive(prevState => !prevState);
    event.preventDefault();
  };

  // captura clique no submenu da topbar/mobile.
  const onMobileSubTopbarMenuClick = (event: any) => {
    mobileTopbarMenuClick = true;

    event.preventDefault();
  };

  // captura clique nos itens do menu.
  const onMenuItemClick = (event: any) => {
    if (!event.item.items) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
  };

  // retorna se a tela é desktop.
  const isDesktop = () => {
    return window.innerWidth >= 992;
  };

  const menu = [
    {
      label: 'Home',
      items: menuItems.filter(menuItem => menuItem.type.includes('personal')),
    },
    {
      label: 'MODULO',
      items: menuItems.filter(
        menuItem =>
          menuItem.authorized.includes('user') &&
          menuItem.type.includes('users')
      ),
    },
  ];

  if (user && user?.group === 'admin') {
    menu.push({
      label: 'Administração',
      items: menuItems.filter(
        menuItem =>
          menuItem.authorized.includes('admin') &&
          menuItem.type.includes('admin')
      ),
    });
  }

  const addClass = (element: any, className: any) => {
    const el = element;
    if (element.classList) element.classList.add(className);
    else el.className += ` ${className}`;
  };

  const removeClass = (element: any, className: any) => {
    const el = element;
    if (element.classList) element.classList.remove(className);
    else
      el.className = element.className.replace(
        new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
        ' '
      );
  };

  const wrapperClass = classNames('layout-wrapper', {
    'layout-overlay': layoutMode === 'overlay',
    'layout-static': layoutMode === 'static',
    'layout-static-sidebar-inactive':
      staticMenuInactive && layoutMode === 'static',
    'layout-overlay-sidebar-active':
      overlayMenuActive && layoutMode === 'overlay',
    'layout-mobile-sidebar-active': mobileMenuActive,
    'p-ripple-disabled': !ripple,
    'p-input-filled': inputStyle === 'filled',
    'layout-theme-light': layoutColorMode === 'light',
  });

  return (
    <div className={wrapperClass} onClick={onWrapperClick} aria-hidden="true">
      <AppTopbar
        onToggleMenuClick={onToggleMenuClick}
        layoutColorMode={layoutColorMode as 'light' | 'dark'}
        // onColorModeChange={onColorModeChange}
        mobileTopbarMenuActive={mobileTopbarMenuActive}
        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
        onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
      />
      <div
        className="layout-sidebar"
        onClick={onSidebarClick}
        aria-hidden="true"
      >
        <AppMenu
          model={menu}
          onMenuItemClick={onMenuItemClick}
          layoutColorMode={layoutColorMode}
        />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">{children}</div>

        <AppFooter layoutColorMode={layoutColorMode as 'light' | 'dark'} />
      </div>
      <CSSTransition
        classNames="layout-mask"
        timeout={{ enter: 200, exit: 200 }}
        in={mobileMenuActive}
        unmountOnExit
      >
        <div className="layout-mask p-component-overlay" />
      </CSSTransition>
    </div>
  );
}

export default Layout;
