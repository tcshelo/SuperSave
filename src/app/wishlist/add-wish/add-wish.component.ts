import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../environments/environment';
import { Helpers } from '../../helpers/helpers';

@Component({
  selector: 'app-add-wish',
  templateUrl: './add-wish.component.html',
  styleUrls: ['./add-wish.component.scss'],
})
export class AddWishComponent implements OnInit {
  uploadedImage: File | null = null;
  productName: string = '';
  storeName: string = '';
  productValue: number = 0;
  savedValue: number = 0;

  constructor(private modalController: ModalController, private helpers: Helpers, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  async addItem() {
    if (!this.productName || !this.storeName || this.productValue <= 0) {
      this.helpers.showFailToast("Preencha todos os campos obrigatórios.");
      return;
    }

    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      try {
        const userData = JSON.parse(localStorageData);
        const uid = userData.uid;

        await addDoc(collection(db, 'wishlist'), {
          productName: this.productName,
          storeName: this.storeName,
          productValue: this.productValue,
          savedValue: this.savedValue,
          userUid: uid
        });

        this.helpers.showSuccessToast("Desejo salvo com sucesso!");

        console.log(this.uploadedImage);
        this.modalController.dismiss({
          productName: this.productName,
          storeName: this.storeName,
          productValue: this.productValue,
          savedValue: this.savedValue,
          uploadedImage: this.uploadedImage
        });  
      } catch (error) {
        this.helpers.showFailToast("Ops... ocorreu um erro!");
      }
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  stopClickPropagation(event: Event) {
    event.stopPropagation();
  }

  uploadImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      return;
    }
    
    const file: File = inputElement.files[0];
  
    if (file) {
      this.uploadedImage = file;
      this.cdr.detectChanges();
    } else {
      this.uploadedImage = null;
    }
  }
}
