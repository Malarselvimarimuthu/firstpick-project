import { lazy } from "react";

const Home = lazy(() =>import('../pages/AdminPages/HomePage') );
// const Admin = lazy(()=> import('../pages/AdminPages/HomePage'));
const CreateProductsPage = lazy(()=>import('../pages/CreateProductsPage'));
const EditProduct = lazy(()=> import('../pages/AdminPages/EditProduct'));
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
    }
];

export default {
    navigationRouts
};

