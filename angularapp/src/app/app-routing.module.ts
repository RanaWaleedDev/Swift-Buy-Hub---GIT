import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { NotFoundComponent } from './screens/not-found/not-found.component';
import { SellItemComponent } from './screens/sell-item/sell-item.component';
import { LoginComponent } from './screens/login/login.component';
import { SearchBotComponent } from './screens/search-bot/search-bot.component';
import { SignUpComponent } from './screens/sign-up/sign-up.component';
import { CategoryComponent } from './screens/category/category.component';
import { ViewCategoryComponent } from './screens/category/view-category/view-category.component';
import { AboutUsComponent } from './screens/footer/about-us/about-us.component';
import { PricingComponent } from './screens/pricing/pricing.component';
import { ChatsComponent } from './screens/chats/chats.component';
import { AdminComponent } from './screens/admin/admin.component';
import { OverviewComponent } from './screens/admin/overview/overview.component';
import { SettingComponent } from './screens/toolbar/setting/setting.component';
import { FaqsComponent } from './screens/faqs/faqs.component'; 
import { CategoriesallComponent } from './screens/category/categoriesall/categoriesall.component';
import { FedbackComponent } from './screens/footer/fedback/fedback.component';
import { ContactComponent } from './screens/footer/contact/contact.component';
import { ResetpasswordComponent } from './screens/login/resetpassword/resetpassword.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'home',component:HomeComponent},
  {path:'sell',component:SellItemComponent},
  {path:'login',component:LoginComponent},
  {path:'search',component:SearchBotComponent},
  {path:'sign-up',component:SignUpComponent},
  {path:'category/view/:name',component:CategoryComponent},
  {path:'category/view/:name/:id',component:ViewCategoryComponent},
  {path:'aboutus',component:AboutUsComponent},
  {path:'pricing',component:PricingComponent},
  {path:'chats/:id',component:ChatsComponent},
  {path:'setting/user',component:SettingComponent},
  {path:'faqs/users',component:FaqsComponent},
  {path:'categories/all',component:CategoriesallComponent},
  {path:'feedback/customer',component:FedbackComponent},
  {path:'ContactUs',component:ContactComponent},
  {path:'login/resetpassword',component:ResetpasswordComponent},
  // {path:'users/admin/:id',component:AdminComponent},
  {
    path: 'users/admin/:id',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      // { path: 'transactions', component: AdminTransactionsComponent },
      // Add more child routes as needed
    ]
  },


  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
