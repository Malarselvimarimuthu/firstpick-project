import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));

const Test = lazy(() => import('../pages/CreateProductsPage'));
const Billing = lazy(() => import('../pages/BillingDetails'));
const Products = lazy(() => import('../pages/FetchProductsPage'));
const ProductDetails = lazy(() => import('../pages/DisplayProductsPage'));
const SearchResults = lazy(() => import('../pages/SearchResults'));
const Login = lazy(() => import('../pages/LoginPage'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Profile = lazy(() => import('../pages/Profile'));
const Contact = lazy(() => import('../pages/ContactPage'));
const CustomerQuery = lazy(() => import('../pages/CustomerQuery'));


export const navigationRouts =  [
    {
        name: 'Home',
        path: '/mm',
        component: <Home/>
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
        name: 'Products',
        path: '/',
        component: <Products/>
    },
    {
        name: 'ProductDetails',
        path: '/product/:id',
        component: <ProductDetails/>
    },
    {
        name: 'Search',
        path: '/search',
        component: <SearchResults />
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

