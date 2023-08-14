import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-wish',
  templateUrl: './add-wish.component.html',
  styleUrls: ['./add-wish.component.scss'],
})
export class AddWishComponent implements OnInit {
  imageSrc: string | ArrayBuffer | null = null;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  addItem() {
    console.log("in progress");
  }

  addImg() {
    const newItem = {
      img: this.imageSrc || 'img',
    };
    this.modalController.dismiss(newItem);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  uploadImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
      // Se event.target for nulo ou não tiver arquivos, sai da função
      return;
    }
  
    const file: File = inputElement.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageSrc = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.imageSrc = null;
    }
  }
  
  

  clearImage() {
    this.imageSrc = null;
  }
}
