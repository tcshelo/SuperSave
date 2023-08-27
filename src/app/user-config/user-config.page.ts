import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../../environments/environment';
import { Helpers } from '../helpers/helpers';
import { ModalController } from '@ionic/angular';
import { db } from '../../environments/environment';
import { doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.page.html',
  styleUrls: ['./user-config.page.scss'],
})
export class UserConfigPage implements OnInit {
  name: string = '';
  email: string = '';
  user: string = '';
  avatar: string = '';
  payment: number = 0;
  presentingElement: any = null;

  newPayment: number = 0;
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  path: string = '../../assets/avatar';
  avatars = [
    `${this.path}/0.png`,
    `${this.path}/1.png`,
    `${this.path}/2.png`,
    `${this.path}/3.png`,
    `${this.path}/4.png`,
    `${this.path}/5.png`,
    `${this.path}/6.png`,
    `${this.path}/7.png`,
    `${this.path}/8.png`,
    `${this.path}/9.png`,
    `${this.path}/10.png`,
    `${this.path}/11.png`
  ];
  selectedAvatar: string = '';

  constructor(private router: Router, private helpers: Helpers, private modalController: ModalController) {
  }

  ngOnInit() {
    this.loadUserData();
    this.presentingElement = document.querySelector('.ion-page');
  }

  async loadUserData() {
    const userData = await this.helpers.getUserData();

    if (userData) {
      this.name = userData['name'];
      this.email = userData['email'];
      this.user = `@${userData['user']}`;
      this.avatar = userData['avatar'];
      this.payment = userData['payment'];
    }
  }

  async changePayment() {
    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      const userData = JSON.parse(localStorageData);
      const uid = userData.uid;

      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('oid', '==', uid));

      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDocSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDocSnapshot.id);

        // Atualizar o campo 'payment' com o novo valor
        await updateDoc(userDocRef, { payment: this.newPayment });
        await this.modalController.dismiss();

        this.payment = this.newPayment;
        this.helpers.showSuccessToast("Salário atualizado com sucesso!");
      } else {
        this.helpers.showFailToast("Ops... algo não deu certo!");
      }
    }
  }

  async changePassword() {
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(`${user.email}`, this.password);

      await reauthenticateWithCredential(user, credential);

      if (this.newPassword.length >= 6) {
        if (this.newPassword === this.confirmNewPassword) {
          try {
            await updatePassword(user, this.newPassword);
            await this.modalController.dismiss();
            this.helpers.showSuccessToast("Senha atualizada com sucesso!");
          } catch (error) {
            console.error('Erro ao alterar a senha:', error);
          }
        } else {
          this.helpers.showFailToast("As senhas não correspondem, tente novamente.");
        }
      } else {
        this.helpers.showFailToast("A senha deve conter 6 caracteres ou mais.");
      }
    }
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

  async changeAvatar () {
    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      const userData = JSON.parse(localStorageData);
      const uid = userData.uid;

      const usersCollectionRef = collection(db, 'users');
      const userQuery = query(usersCollectionRef, where('oid', '==', uid));

      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDocSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDocSnapshot.id);

        await updateDoc(userDocRef, { avatar: this.selectedAvatar });
        await this.modalController.dismiss();

        this.avatar = this.selectedAvatar;
        this.helpers.showSuccessToast("Avatar atualizado com sucesso!");
      } else {
        this.helpers.showFailToast("Ops... algo não deu certo!");
      }
    }
  }

  modalDismiss() {
    this.modalController.dismiss();
  }

  async logout() {
    try {
      this.helpers.setUserData([]);
      localStorage.setItem("@detailUser", JSON.stringify([]));
      localStorage.setItem("@incomesAndExpenses", JSON.stringify([]));
      await auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
