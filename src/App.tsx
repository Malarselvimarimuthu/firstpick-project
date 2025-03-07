import { BrowserRouter, Route, Routes } from "react-router-dom";
import authRoutes from "./routes/auth.routes";
import nonAuthRoutes from "./routes/nonauth.routes";
import SuspenseLayout from "./layouts/SuspenseLayout";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/protected.routes";


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes (No Auth Required) */}
                    <Route element={<SuspenseLayout />}>
                    <Route element={<MainLayout />}>
                        {nonAuthRoutes.navigationRouts.map((data) => (
                            <Route path={data.path} key={data.name} element={data.component} />
                        ))}
                        </Route>
                    </Route>

                    {/* Authenticated Routes (Require Login) */}
                    <Route element={<SuspenseLayout />}>
                        <Route element={<ProtectedRoute />}>
                            <Route element={<MainLayout />}>
                                {authRoutes.navigationRouts.map((data) => (
                                    <Route path={data.path} key={data.name} element={data.component} />
                                ))}
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
