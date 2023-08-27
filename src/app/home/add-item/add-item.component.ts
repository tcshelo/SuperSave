import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  @Input() lista: any;
  @Input() selectedOption: string = '2';
  itemName: string | undefined;
  itemValue: number | undefined;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  addItem() {
    const newItem = {
      name: this.itemName,
      value: this.itemValue,
      type: this.selectedOption
    };

    this.modalController.dismiss(newItem);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
