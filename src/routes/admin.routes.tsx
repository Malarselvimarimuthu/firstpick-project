import { lazy } from "react";

const Home = lazy(() =>import('../pages/AdminPages/HomePage') );


export const navigationRouts =  [

    {
        name: 'CartProducts',
        path: '/',
        component: <Home/>
    }
];

export default {
    navigationRouts
};

