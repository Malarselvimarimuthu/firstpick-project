import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Cart = lazy(() => import('../pages/CartPage'));
const Test = lazy(() => import('../pages/testPage'));
const Billing = lazy(() => import('../pages/BillingDetails/BilligForm'));


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

    }
];

export default {
    navigationRouts
};

