import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import {Navbar} from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MainLayout() {
  return (
    <>
      <Header />
      <Navbar/>
      <Outlet />
      <Footer/>
    </>
  );
}