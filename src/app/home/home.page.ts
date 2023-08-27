import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { Helpers } from '../helpers/helpers';
import { 
  collection, 
  doc,
  addDoc,
  getDocs, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('emptyTemplate', { static: false }) emptyTemplate?: TemplateRef<any>;

  name: string = '';
  payment: number = 0;
  avatar: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  currentIcon = 'eye-outline';
  originalMoney = 0;
  hiddenMoney = '***';
  showRealValue = true;
  incomes: any[] = [];
  expenses: any[] = [];
  lineStyleIncome: any;
  lineStyleExpenses: any;

  public pickerColumns = [
    {
      name: 'months',
      options: this.helpers.getMonths()
    },
  ];

  public pickerButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Confirm',
      handler: (value: any) => {
        this.save(value.months.value);
      },
    },
  ];

  constructor(private modalController: ModalController, private helpers: Helpers) {
  }

  ngOnInit() {
    this.loadDataFromLocalstorage();
    this.loadUserData();
  }

  private loadDataFromLocalstorage() {
    const dataFromLocalStorage = localStorage.getItem('@incomesAndExpenses');
    if (dataFromLocalStorage) {
      const parsedData = JSON.parse(dataFromLocalStorage);
      this.incomes = parsedData.incomes || [];
      this.expenses = parsedData.expenses || [];
      this.originalMoney = parsedData.originalMoney || 0;
    }
  }

  async loadUserData() {
    const userData = await this.helpers.getUserData();

    if (userData) {
      this.name = userData['name'];
      this.payment = userData['payment'];
      this.avatar = userData['avatar'];
      
      const isSalaryPresent = this.incomes.some(item => item[0] === "Salário");
      if (this.payment > 0 && !isSalaryPresent) {
        this.incomes.push(["Salário", this.payment])
        this.originalMoney += this.payment;
      }
    }
  }

  async save(value: any) {
    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      const userData = JSON.parse(localStorageData);
      const uid = userData.uid;
      const querySnapshot = await getDocs(
        query(collection(db, 'resume'), where('userUid', '==', uid), where('month', '==', value))
      );

      let totalIncome = 0;
      let totalExpense = 0;
  
      for (const income of this.incomes) {
        totalIncome += income[1];
      }
  
      for (const expense of this.expenses) {
        totalExpense += expense[1];
      }
  
      const balance = totalIncome - totalExpense;
  
      const resumeData = {
        userUid: uid,
        month: value,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        balance: balance
      };
  
      try {
        if (querySnapshot.empty) {
          await addDoc(collection(db, 'resume'), resumeData);
        } else {
          const docRef = doc(db, 'resume', querySnapshot.docs[0].id);
          await updateDoc(docRef, resumeData);
        }
        this.helpers.showSuccessToast("Dados salvos com sucesso!");
      } catch (error) {
        this.helpers.showSuccessToast("Ops... algo deu errado!");
      }
    }
  }

  toggleMoneyVisibility() {
    this.showRealValue = !this.showRealValue;
    this.currentIcon = this.showRealValue ?  'eye-outline' : 'eye-off-outline';
  }

  getMoneyToShow() {
    return this.showRealValue ? this.originalMoney.toFixed(2).replace('.', ',') : this.hiddenMoney;
  }

  private saveDataToLocalstorage() {
    const dataToSave = {
      incomes: this.incomes,
      expenses: this.expenses,
      originalMoney: this.originalMoney
    };
    localStorage.setItem('@incomesAndExpenses', JSON.stringify(dataToSave));
  }

  async handleAddItem() {
    const modal = await this.modalController.create({
      component: AddItemComponent
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.type === '1') {
          this.incomes.push([result.data.name, result.data.value]);
          this.originalMoney += result.data.value;
        } else if (result.data.type === '2') {
          this.expenses.push([result.data.name, result.data.value]);
          this.originalMoney -= result.data.value;
        }
      }
      this.saveDataToLocalstorage();
    });
  
    return await modal.present();
  }

  countIncomesAndExpenses() {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const income of this.incomes) {
      totalIncome += income[1];
    }

    for (const expense of this.expenses) {
      totalExpense += expense[1];
    }

    return this.originalMoney = totalIncome - totalExpense;
  }

  async removeItem(index: number, type: number, value: number) {
    if (type === 1) {
      this.incomes.splice(index, 1);
      this.originalMoney -= value;
    } else {
      this.expenses.splice(index, 1);
      this.originalMoney += value;
    }
    this.saveDataToLocalstorage();
  }

  async editItem(index: number, type: number) {
    var item;

    if (type === 1) {
      item = this.incomes[index]; 
    } else {
      item = this.expenses[index];
    }

    const modal = await this.modalController.create({
      component: EditItemComponent,
      componentProps: {
        item: item,
        index: index,
        type: type,
        incomes: this.incomes,
        expenses: this.expenses
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result) {
        item = result.data;
        this.countIncomesAndExpenses();
        this.saveDataToLocalstorage();
      }
    });

    return await modal.present();
  }

}
