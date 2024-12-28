import { lazy } from "react";

const Home = lazy(() => import('../pages/HomePage'));

export const navigationRouts =  [
    {
        name: 'Home',
        path: '/',
        component: <Home/>
    }
];

export default {
    navigationRouts
};