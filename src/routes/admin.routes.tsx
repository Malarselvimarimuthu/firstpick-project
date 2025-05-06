import { lazy } from "react";

const Home = lazy(() =>import('../pages/AdminPages/HomePage') );
// const Admin = lazy(()=> import('../pages/AdminPages/HomePage'));
const CreateProductsPage = lazy(()=>import('../pages/CreateProductsPage'));
const EditProduct = lazy(()=> import('../pages/AdminPages/EditProduct'));
const Orders = lazy(()=> import('../pages/AdminPages/OrdersPage'));
export const navigationRouts =  [

    {
        name: 'AdminHome',
        path: '/admin/',
        component: <Home/>
    },
    {
        name: 'AdminHome',
        path: '/admin/add-product',
        component: <CreateProductsPage/>
    },
    {
        name: 'EditProduct',
        path: '/admin/edit-product/:productId',
        component: <EditProduct/>
    },
    {
        name:'Orders',
        path: '/admin/orders',
        component: <Orders/>
    }
];

export default {
    navigationRouts
};

