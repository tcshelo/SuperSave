import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../../environments/environment';
import { Helpers } from '../helpers/helpers';
import { ModalController } from '@ionic/angular';
import { db } from '../../environments/environment';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

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
      const userQuery = query(usersCollectionRef, where('uid', '==', uid));

      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDocSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', userDocSnapshot.id);

        // Atualizar o campo 'payment' com o novo valor
        await updateDoc(userDocRef, { payment: this.newPayment });

        console.log('Pagamento atualizado com sucesso!');
      } else {
        console.log('Usuário não encontrado no Firestore.');
      }
    }
  }

  teste () {
  }

  async logout() {
    try {
      this.helpers.setUserData([]);
      localStorage.setItem("@detailUser", JSON.stringify([]));
      await auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
