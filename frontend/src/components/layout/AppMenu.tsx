/* eslint-disable react/destructuring-assignment */
import classNames from 'classnames';
import { Badge } from 'primereact/badge';
import { Ripple } from 'primereact/ripple';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

function AppSubmenu(props: any) {
  const [activeIndex, setActiveIndex] = useState(null);

  const onMenuItemClick = (event: any, item: any, index: any) => {
    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    if (index === activeIndex) setActiveIndex(null);
    else setActiveIndex(index);

    if (props.onMenuItemClick) {
      props.onMenuItemClick({
        originalEvent: event,
        item,
      });
    }
    return false;
  };

  const onKeyDown = (event: any) => {
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      event.target.click();
    }
  };

  const renderLinkContent = (item: any) => {
    const submenuIcon = item.items && (
      <i className="pi pi-fw pi-angle-down menuitem-toggle-icon" />
    );
    const badge = item.badge && <Badge value={item.badge} />;

    return (
      <>
        <i
          className={item.icon}
          style={{
            width: '1.2rem',
            height: '1.2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <span>{item.label}</span>
        {submenuIcon}
        {badge}
        <Ripple />
      </>
    );
  };

  const renderLink = (item: any, i: any) => {
    const content = renderLinkContent(item);

    if (item.to) {
      return (
        <NavLink
          aria-label={item.label}
          onKeyDown={onKeyDown}
          role="menuitem"
          className="p-ripple"
          // activeClassName="router-link-active router-link-exact-active"
          to={item.to}
          onClick={e => onMenuItemClick(e, item, i)}
          // exact
          target={item.target}
        >
          {content}
        </NavLink>
      );
    }
    return (
      <a
        // tabIndex="0"
        aria-label={item.label}
        onKeyDown={onKeyDown}
        role="menuitem"
        href={item.url}
        className="p-ripple"
        onClick={e => onMenuItemClick(e, item, i)}
        target={item.target}
      >
        {content}
      </a>
    );
  };

  const items =
    props.items &&
    props.items.map((item: any, i: any) => {
      const active = activeIndex === i;
      const styleClass = classNames(item.badgeStyleClass, {
        'layout-menuitem-category': props.root,
        'active-menuitem': active && !item.to,
      });

      if (props.root) {
        return (
          <li className={styleClass} key={item.label} role="none">
            {props.root === true && (
              <>
                <div
                  className="layout-menuitem-root-text"
                  aria-label={item.label}
                >
                  {item.label}
                </div>
                <AppSubmenu
                  items={item.items}
                  onMenuItemClick={props.onMenuItemClick}
                />
              </>
            )}
          </li>
        );
      }
      return (
        <li className={styleClass} key={item.label} role="none">
          {renderLink(item, i)}
          <CSSTransition
            classNames="layout-submenu-wrapper"
            timeout={{ enter: 1000, exit: 450 }}
            in={active}
            unmountOnExit
          >
            <AppSubmenu
              items={item.items}
              onMenuItemClick={props.onMenuItemClick}
            />
          </CSSTransition>
        </li>
      );
    });

  return items ? (
    <ul className={props.className} role="menu">
      {items}
    </ul>
  ) : null;
}

export function AppMenu(props: any) {
  return (
    <div className="layout-menu-container">
      <AppSubmenu
        items={props.model}
        className="layout-menu"
        onMenuItemClick={props.onMenuItemClick}
        root
        role="menu"
      />
    </div>
  );
}
