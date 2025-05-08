// type IDocumentTypeDTO = {
//   id?: string;
//   description: string;
//   category: string;
//   type: string;
// };

// // Tudo o que é retornado do context
// interface IDocumentTypeContext {
//   globalFilter: string;
//   action: IActionType;
//   allDocTypes: IDocumentTypeDTO[];
//   loadingData: boolean;
//   formik: any; //MUDAR
//   filterTable: (value: string) => void;
//   resetForm: () => void;
//   changeAction: (actionValue: IActionType) => void;
// }

// // props do provider
// interface IDocumentTypeProviderProps {
//   children: React.ReactNode;
// }

// export const DocumentTypeContext = createContext({} as IDocumentTypeContext);

// // Valor inicial do estado
// const DocumentTypeInitialValue: IDocumentTypeDTO = {
//   description: '',
//   category: '',
//   type: '',
// };

// export const DocumentTypeProvider = ({
//   children,
// }: IDocumentTypeProviderProps) => {
//   // CODE

//   return (
//     <DocumentTypeContext.Provider
//       value={{
//         globalFilter,
//         allDocTypes,
//         loadingData,
//         formik,
//         resetForm,
//         changeAction,
//         action,
//         filterTable,
//       }}
//     >
//       {children}
//     </DocumentTypeContext.Provider>
//   );
// };
