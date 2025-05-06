import { lazy } from "react";

const Cart = lazy(() =>import('../pages/CartPage') );
const Test = lazy(() => import('../pages/CreateProductsPage'));
const Billing = lazy(() => import('../pages/BillingDetails'));
const Profile = lazy(() => import('../pages/Profile'));
const CustomerQuery = lazy(() => import('../pages/CustomerQuery'));

const OrderSuccessPage= lazy(()=>import('../pages/OrderSuccessfull'));
const OrderPage = lazy(()=> import('../pages/OrderPage'));

export const navigationRouts =  [

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
        name: 'Profile',
        path: '/profile',
        component: <Profile/>
    },
    {
        name: 'CustomerQuery',
        path: '/customerquery',
        component: <CustomerQuery/>
    },
    {
        name: 'CartProducts',
        path: '/cart',
        component: <Cart/>
    },
    {
        name: 'OrderSuccessPage',
        path: '/order-success',
        component: <OrderSuccessPage/>
    },
    {
        name: 'OrdersPage',
        path:'/orders',
        component: <OrderPage/>
    }
];

export default {
    navigationRouts
};

