import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import {Navbar} from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from "../../context/AuthContext";
import  AdminNavbar  from "../../pages/AdminPages/AdminNavbar"

export default function MainLayout() {
  const { user } = useAuth();
  return (
    <>
       {user?.isAdmin ? (
        <>
          {/* <Header /> */}
          <AdminNavbar />
        </>
      ) : (
        <>
          <Header />
          <Navbar />
        </>
      )}
      <Outlet />
      <Footer/>
    </>
  );
}