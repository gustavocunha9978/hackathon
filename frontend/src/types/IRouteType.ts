import React from 'react';
import { RouteObject } from 'react-router-dom';
import { IPermissionsType } from './IPermissionsType';

export interface IRouteType extends IRouteProps {}

export interface IBaseRoute extends Omit<IRouteProps, 'permissions'> {
  children: IChildrenRoute[];
}

interface IRouteProps {
  path: string;
  element?: React.ReactNode;
  permissions: IPermissionsType[];
  children?: IChildrenRoute[];
}

interface IChildrenRoute extends Omit<IRouteProps, 'children'> {}
