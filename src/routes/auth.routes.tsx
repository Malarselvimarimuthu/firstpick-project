import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Cart = lazy(() => import('../pages/CartPage'));
const Test = lazy(() => import('../pages/testPage'));
const Billing = lazy(() => import('../pages/BillingDetails'));
const Login = lazy(() => import('../pages/LoginPage'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Profile = lazy(() => import('../pages/Profile'));
const Contact = lazy(() => import('../pages/ContactPage'));
const CustomerQuery = lazy(() => import('../pages/CustomerQuery'));

export const navigationRouts =  [
    {
        name: 'Home',
        path: '/',
        component: <Home/>
    },
    {
        name: 'Cart',
        path: '/cart',
        component: <Cart/>
    },
    {
        name: 'Test',
        path: '/test',
        component: <Test/>
    },
    {
        name: 'Billing',
        path: '/billing',
        component: <Billing/>

    },
    {
        name: 'Login',
        path: '/login',
        component: <Login/>

    },
    {
        name: 'SignUp',
        path: '/signup',
        component: <SignUp/>

    },
    {
        name: 'Profile',
        path: '/profile',
        component: <Profile/>

    },
    {
        name: 'Contact',
        path: '/contact',
        component: <Contact/>

    },
    {
        name: 'CustomerQuery',
        path: '/customerquery',
        component: <CustomerQuery/>

    }
];

export default {
    navigationRouts
};

