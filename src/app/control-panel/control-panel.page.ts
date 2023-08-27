import { Component, OnInit } from '@angular/core';
import { db } from '../../environments/environment';
import { doc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.page.html',
  styleUrls: ['./control-panel.page.scss'],
})
export class ControlPanelPage implements OnInit {
  periodos: Array<any> = [];
  totalColor: string = 'primary';

  constructor() { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      const userData = JSON.parse(localStorageData);
      const userUid = userData.uid;

      const q = query(collection(db, 'resume'), where('userUid', '==', userUid));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const resumeData = doc.data();

        // Formate os dados obtidos para se encaixar na estrutura do array "periodos"
        const periodo = {
          periodo: resumeData['month'],
          receitas: resumeData['totalIncome'],
          despesas: resumeData['totalExpense'],
          saldo: resumeData['balance'],
        };

        // Adicione os dados ao array "periodos"
        this.periodos.push(periodo);
      });
    }
  }

  getSaldoColor(saldo: number): string {
    return saldo >= 0 ? 'primary' : 'danger';
  }
}
