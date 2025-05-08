import classNames from 'classnames';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../../layout/images/bioparkLogo.png';
import logoBranco from '../../layout/images/bioparkLogoBrancoRosa.png';

interface AppTopbarProps {
  onMobileTopbarMenuClick: (event: any) => void; // tipar evento
  onToggleMenuClick: (event: any) => void; // tipar evento
  onMobileSubTopbarMenuClick: (event: any) => void; // tipar evento
  mobileTopbarMenuActive: any;
  layoutColorMode: 'light' | 'dark';
}
export function AppTopbar({
  onMobileTopbarMenuClick,
  onToggleMenuClick,
  mobileTopbarMenuActive,
  layoutColorMode,
  onMobileSubTopbarMenuClick,
}: AppTopbarProps) {
  const navigate = useNavigate();
  // const { user, signOut } = useAuth();

  let environment = '';

  console.log(import.meta.env.MODE);

  switch (import.meta.env.MODE) {
    case 'development':
      environment = 'layout-topbar layout-topbar-dev';
      break;

    case 'beta':
      environment = 'layout-topbar layout-topbar-beta';
      break;

    default:
      environment = 'layout-topbar';
      break;
  }

  const isDesktop = () => {
    return window.innerWidth >= 992;
  };

  return (
    <div className={environment}>
      <Link to="/" className="layout-topbar-logo">
        <img src={layoutColorMode === 'light' ? logo : logoBranco} alt="logo" />
      </Link>

      {import.meta.env.MODE === 'development' && (
        <Chip label="DEV" className="p-chip-dev" />
      )}
      {import.meta.env.MODE === 'beta' && (
        <Chip label="BETA" className="p-chip-beta" />
      )}

      <button
        type="button"
        className="p-link  layout-menu-button layout-topbar-button"
        onClick={onToggleMenuClick}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={onMobileTopbarMenuClick}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul
        className={classNames('layout-topbar-menu lg:flex origin-top', {
          'layout-topbar-menu-mobile-active': mobileTopbarMenuActive,
        })}
      >
        <li>
          <button
            type="button"
            className="p-link layout-topbar-button"
            onClick={event => {
              onMobileSubTopbarMenuClick(event);
              navigate('/sobre');
            }}
          >
            <i className="pi pi-info-circle" />
            <span>Sobre o GDI</span>
          </button>
        </li>

        {!isDesktop() ? <Divider /> : ''}

        <li
          className={isDesktop() ? 'user-list-item' : 'user-list-item-mobile'}
        >
          <button
            type="button"
            className="p-link layout-topbar-button"
            onClick={event => {
              // tipar evento
              onMobileSubTopbarMenuClick(event);
              // signOut();
            }}
          >
            <i className="pi pi-sign-out" />
            {isDesktop() ? <p>Nome Usuário</p> : <span>Sair</span>}
          </button>
          {!isDesktop() ? <p>Nome Usuário</p> : ''}
        </li>
      </ul>
    </div>
  );
}
