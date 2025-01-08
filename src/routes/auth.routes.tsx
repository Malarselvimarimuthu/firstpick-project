import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Test = lazy(() => import('../pages/CreateProductsPage'));
const Billing = lazy(() => import('../pages/BillingDetails'));
const Products = lazy(() => import('../pages/FetchProductsPage'));
const ProductDetails = lazy(() => import('../pages/DisplayProductsPage'));
const SearchResults = lazy(() => import('../pages/SearchResults'));


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
    }
];

export default {
    navigationRouts
};

