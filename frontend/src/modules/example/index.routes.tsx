// import React, { ElementType, ReactElement } from 'react';
// import { IRouteType } from '../../types/IRouteType';
// import { DocumentTypeProvider } from './index.context';
// import { ListDocumentTypes } from './pages/List';
// import { RegisterDocumentTypes } from './pages/Register';

// // MUDAR ESSE ANY! Ainda não consegui achar o tipo correto
// const renderElement = (Component: any) => (
//   <DocumentTypeProvider>
//     <Component />
//   </DocumentTypeProvider>
// );

// export const DocumentTypesRoutes: IRouteType = {
//   path: '/tipos-documentos',
//   permissions: ['user'],
//   children: [
//     {
//       path: '',
//       element: renderElement(ListDocumentTypes),
//       permissions: ['user'],
//     },
//     {
//       path: 'cadastro',
//       element: renderElement(RegisterDocumentTypes),
//       permissions: ['user'],
//     },
//     {
//       path: 'editar/:id',
//       element: renderElement(RegisterDocumentTypes),
//       permissions: ['user'],
//     },
//   ],
// };
