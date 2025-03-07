import {lazy} from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Login = lazy(() => import('../pages/LoginPage'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Products = lazy(() => import('../pages/FetchProductsPage'));
const ProductDetails = lazy(() => import('../pages/DisplayProductsPage'));
const CategoryProducts = lazy(() => import('../pages/CategoryProducts'));
const Contact = lazy(() => import('../pages/ContactPage'));
const SearchResults = lazy(() => import('../pages/SearchResults'));

export const navigationRouts = [
    {
        path: '/login',
        name: 'Login',
        component: <Login />
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: <SignUp />
    },   
     {
        name: 'Home',
        path: '/mm',
        component: <Home/>
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
        name: 'CategoryProducts',
        path: '/:category',
        component: <CategoryProducts/>
    },
    {
        name: 'Contact',
        path: '/contact',
        component: <Contact/>
    },

];

export default {
    navigationRouts
};