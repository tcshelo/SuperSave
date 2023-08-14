import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddItemComponent } from '../add-item/add-item.component';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { Helpers } from '../helpers/helpers';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('emptyTemplate', { static: false }) emptyTemplate?: TemplateRef<any>;

  name: string = '';
  payment: number = 0;
  currentIcon = 'eye-outline';
  originalMoney = 0;
  hiddenMoney = '***';
  showRealValue = true;
  incomes: any[] = [];
  expenses: any[] = [];
  lineStyleIncome: any;
  lineStyleExpenses: any;

  constructor(private modalController: ModalController, private helpers: Helpers) {
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const userData = await this.helpers.getUserData();

    if (userData) {
      this.name = userData['name'];
      this.payment = userData['payment'];
      
      if (this.payment > 0) {
        this.incomes.push(["Salário", this.payment])
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

  async handleAddItem() {
    const modal = await this.modalController.create({
      component: AddItemComponent
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (result.data.type === '1') {
          this.incomes.push([result.data.name, result.data.value]);
        } else if (result.data.type === '2') {
          this.expenses.push([result.data.name, result.data.value]);
        }
      }
    });
  
    return await modal.present();
  }

  async removeItem(index: number, type: number) {
    if (type === 1) {
      this.incomes.splice(index, 1);
    } else {
      this.expenses.splice(index, 1);
    }
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
        type: type
      }
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'salvar') {
        item = result.data;
      }
    });
    
    return await modal.present();
  }

}
