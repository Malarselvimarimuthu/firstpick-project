import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));
const Billing = lazy(() => import('../pages/BillingDetails/BilligForm'));

export const navigationRouts =  [
    {
        name: 'Home',
        path: '/',
        component: <Home/>
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

