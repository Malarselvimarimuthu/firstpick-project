import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Cart = lazy(() => import('../pages/CartPage'));
const Test = lazy(() => import('../pages/testPage'));

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
    }
];

export default {
    navigationRouts
};