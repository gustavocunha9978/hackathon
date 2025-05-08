import { AboutGdi } from '.';
import { IRouteType } from '../../types/IRouteType';

export const AboutRoute: IRouteType = {
  path: 'sobre',
  element: <AboutGdi />,
  permissions: ['user'],
};
