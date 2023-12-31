import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { db } from '../../environments/environment';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class Helpers {
  private userData: any;

  constructor(private toastController: ToastController) { }

  async showFailToast(msg: string) {
    const toast = await this.toastController.create({
        message: msg,
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
    
      await toast.present();
  }

  async showSuccessToast(msg: string) {
    const toast = await this.toastController.create({
        message: msg,
        duration: 3000,
        color: 'success',
        position: 'top'
      });
    
      await toast.present();
  }

  async getUserData() {
    const localStorageData = localStorage.getItem('@detailUser');
  
    if (localStorageData !== null) {
      try {
        const userData = JSON.parse(localStorageData);
        const uid = userData.uid; 
  
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(query(usersCollectionRef, where('oid', '==', uid)));
        const userDocSnapshot = querySnapshot.docs[0];
        const userTableData = userDocSnapshot.data();

        return this.userData = userTableData;
      } catch (error) {
        console.log("Erro ao carregar os dados do usuário:", error);
      }
    }
    return null;
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getMonths() {
    const months = [
      {
        text: 'Janeiro',
        value: 'Janeiro',
      },
      {
        text: 'Fevereiro',
        value: 'Fevereiro',
      },
      {
        text: 'Março',
        value: 'Março',
      },
      {
        text: 'Abril',
        value: 'Abril',
      },
      {
        text: 'Maio',
        value: 'Maio',
      },
      {
        text: 'Junho',
        value: 'Junho',
      },
      {
        text: 'Julho',
        value: 'Julho',
      },
      {
        text: 'Agosto',
        value: 'Agosto',
      },
      {
        text: 'Setembro',
        value: 'Setembro',
      },
      {
        text: 'Outubro',
        value: 'Outubro',
      },
      {
        text: 'Novembro',
        value: 'Novembro',
      },
      {
        text: 'Dezembro',
        value: 'Dezembro',
      }
    ];

    return months;
  }
}
