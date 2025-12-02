import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { NoPageFound } from './components/no-page-found/no-page-found';
import { BaseComponent } from './components/base-component/base-component';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Partner } from './components/partner/partner';
import { CreatePartner } from './components/create-partner/create-partner';
import { Dashboard } from './components/dashboard/dashboard';
import { ResetPassword } from './components/reset-password/reset-password';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';
import { EditPartner } from './components/edit-partner/edit-partner';
import { UserList } from './components/user-list/user-list';
import { CreateExpert } from './components/create-expert/create-expert';
import { EditExpert } from './components/edit-expert/edit-expert';
import { Expert } from './components/expert/expert';
import { Products } from './components/products/products';
import { ProductList } from './components/product-list/product-list';
import { CreateDelivery } from './components/create-delivery/create-delivery';
import { DeliveryList } from './components/delivery-list/delivery-list';
import { CreateCustomer } from './components/customer/customer';
import { CustomerProduct } from './components/customer-products/customer-products';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  // 🔓 UNPROTECTED customer area
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'customer/products', component: CustomerProduct }, // /customer/products
      { path: 'cart', component: CartComponent }, // ✅ /cart
    ],
  },

  // 🔒 PROTECTED admin/partner area
  {
    path: '',
    component: BaseComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: Dashboard, title: 'dashboard' },

      {
        path: 'partner',
        children: [
          { path: '', component: Partner },
          { path: 'create', component: CreatePartner },
          { path: 'edit/:id', component: EditPartner },
        ],
      },

      {
        path: 'expert',
        children: [
          { path: '', component: Expert },
          { path: 'create', component: CreateExpert },
          { path: 'edit/:id', component: EditExpert },
        ],
      },

      { path: 'deliveries', component: DeliveryList },
      { path: 'deliveries/create', component: CreateDelivery },

      { path: 'products', component: ProductList },
      { path: 'products/create', component: Products },

      { path: 'customer/create', component: CreateCustomer },
      { path: 'users', component: UserList },
    ],
  },

  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'register', component: Register, canActivate: [loginGuard] },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: '**', component: NoPageFound },
];
