import { Route, Routes } from 'react-router-dom';
import { PrivateRoutes } from './routes/PrivateRoutes';
import { AdminRoutes } from './routes/AdminRoutes';


function App() {

  return (
    <Routes>
      <Route path="/" element={<PrivateRoutes />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admin/" element={<AdminRoutes />}>
      </Route>
    </Routes>
  );
}

export default App;
