import { BrowserRouter, Route, Routes } from 'react-router-dom';
import authRoutes from './routes/auth.routes';
import SuspenseLayout from './layouts/SuspenseLayout';
import MainLayout from './layouts/MainLayout';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route  element= {<SuspenseLayout/>}>
            <Route element={<MainLayout/>}>
              {authRoutes.navigationRouts.map((data) => {
                return <Route path={data.path} key={data.name} element={data.component} />;
              })}
            </Route>
            {/* <Route>
              {nonAuthRoutes.map((data) => {
                return <Route path={data.path} element={data.component} key={data.name} />;
              })}
            </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;