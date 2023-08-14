import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../auth';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'controlPanel',
        loadChildren: () => import('../control-panel/control-panel.module').then(m => m.ControlPanelPageModule),
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'wishlist',
        loadChildren: () => import('../wishlist/wishlist.module').then(m => m.WishlistPageModule),
      },
      {
        path: 'userConfig',
        loadChildren: () => import('../user-config/user-config.module').then(m => m.UserConfigPageModule),
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
