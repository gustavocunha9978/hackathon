type IAuthorizedGroup = 'user' | 'admin';
type IMenuType = 'personal' | 'users' | 'supervisor' | 'admin';

type IMenuItems = {
  label: string;
  icon: string;
  to: string;
  type: IMenuType[];
  authorized: IAuthorizedGroup[];
};
export const menuItems: IMenuItems[] = [
  {
    label: 'dashboard',
    icon: 'pi pi-fw pi-bell',
    to: '/dashboard',
    type: ['personal'],
    authorized: ['user'],
  },
];
