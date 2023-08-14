import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.page.html',
  styleUrls: ['./control-panel.page.scss'],
})
export class ControlPanelPage implements OnInit {
  periodos = [
    { periodo: 'Janeiro', receitas: 1000, despesas: 800, saldo: 200 },
    { periodo: 'Fevereiro', receitas: 1200, despesas: 900, saldo: 300 },
    { periodo: 'Março', receitas: 800, despesas: 900, saldo: -100},
  ]
  totalColor: string = 'primary';

  constructor() { }

  ngOnInit() {
  }

  getSaldoColor(saldo: number): string {
    return saldo >= 0 ? 'primary' : 'danger';
  }
}
