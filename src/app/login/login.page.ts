import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../environments/environment';
import { Helpers } from '../helpers/helpers';
import { RegisterNewUserComponent } from '../register-new-user/register-new-user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showLoginContent = true;

  constructor(
    private router: Router, 
    private modalController: ModalController,
    private helpers: Helpers
    ) {}

  onLoginClick() {
    this.showLoginContent = false;
  }

  onBackClick() {
    this.showLoginContent = true;
  }  

  async login() {
    await signInWithEmailAndPassword(auth, this.email, this.password)
    .then(() => {
      this.router.navigate(['/tabs/home']);
    })
    .catch(() => {
      this.helpers.showFailToast("Usuário e senha não correspondem. Tente novamente.")
    })
  }

  async openRegister() {
    const modal = await this.modalController.create({
      component: RegisterNewUserComponent,
    });

    await modal.present();
  }
}
