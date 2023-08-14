import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Helpers } from '../helpers/helpers';
//import { AddWishComponent } from '../add-wish/add-wish.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  @ViewChild('emptyTemplate', { static: false }) emptyTemplate?: TemplateRef<any>;

  wishlist: any[] = [];
  progressPercentage: number = 0; // Porcentagem do progresso
  porcentageValue: string = '';
  nmProduct: string = '';
  nmStore: string = '';
  vlProduct: number = 0;
  vlInvested: number = 0;

  constructor(
    private modalController: ModalController,
    private helpers: Helpers
  ) { }

  ngOnInit() {
    this.calculateProgressPercentage();
  }

  calculateProgressPercentage() {
    this.progressPercentage = (this.vlInvested / this.vlProduct) * 100;
    this.porcentageValue = this.progressPercentage.toFixed(0) + '%';
  }

  async handleAddItem() {
    this.helpers.showFailToast("Em construção");
  }

  async removeItem(index: number) {
      this.wishlist.splice(index, 1);
  }
}
