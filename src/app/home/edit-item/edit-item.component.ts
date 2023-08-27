import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent  implements OnInit {
  @Input() item: any;
  @Input() type: any;

  editedName: any;
  editedValue: any;
  editedType: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.item && this.item.length > 0) {
      this.editedName = this.item[0];
      this.editedValue = this.item[1];
      this.editedType = this.type;
    }
  }

  saveEdit() {
    this.item[0] = this.editedName;
    this.item[1] = this.editedValue;
    this.type = this.editedType;

    this.modalController.dismiss(this.item);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
