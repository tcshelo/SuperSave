import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddWishComponent } from './add-wish/add-wish.component';
import { db } from '../../environments/environment';
import { 
  collection, 
  doc,
  getDocs, 
  query, 
  where,
  deleteDoc
} from 'firebase/firestore';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishlist: any[] = [];
  nmProduct: string = '';
  nmStore: string = '';
  vlProduct: number = 0;
  vlInvested: number = 0;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.fetchWishlist();
  }

  calculateProgressPercentage(goal: number, invested: number) {
    let progressPercentage = (invested / goal) * 100;
    let porcentageValue = progressPercentage.toFixed(0) + '%';
    
    return porcentageValue;
  }

  async getWishlistFromFirestore(userUid: string) {

    const q = query(collection(db, 'wishlist'), where('userUid', '==', userUid));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (data['userUid'] === userUid) {
        this.wishlist.push(data);
      }
    });

    return this.wishlist;
  }

  async fetchWishlist() {
    const localStorageData = localStorage.getItem('@detailUser');

    if (localStorageData !== null) {
      try {
        const userData = JSON.parse(localStorageData);
        const uid = userData.uid;

        const wishlist = await this.getWishlistFromFirestore(uid);
        this.wishlist = wishlist;

        this.updateImagesInWishlist();
      } catch (error) {
        console.log("error:", error);
      }
    }
  }
  
  updateImagesInWishlist() {
    for (const item of this.wishlist) {
      if (item.uploadedImage) {
        item.imageUrl = this.getImageUrl(item.uploadedImage);
      }
    }
  }

  getImageUrl(file: File | null): string {
    if (file) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  async handleAddItem() {
    const modal = await this.modalController.create({
      component: AddWishComponent
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.wishlist.push(result.data);
      }
    });
  
    return await modal.present();
  }

  async getDocIdToDelete(userUid: string, productName: string, storeName: string) {
    const q = query(
      collection(db, 'wishlist'),
      where('userUid', '==', userUid),
      where('productName', '==', productName),
      where('storeName', '==', storeName)
    );
  
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        return docId;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar docId:', error);
      return null;
    }
  }

  async removeItem(index: number) {
    const item = this.wishlist[index];
    this.wishlist.splice(index, 1);

    if (item && item.userUid && item.productName && item.storeName) {
      const docId = await this.getDocIdToDelete(item.userUid, item.productName, item.storeName);
      if (docId) {
        try {
          await deleteDoc(doc(db, 'wishlist', docId));
        } catch (error) {
          console.error('Erro ao deletar documento:', error);
        }
      }
    }
  }
}
