import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  currentTab: string = 'home';

  constructor(private activatedRoute: ActivatedRoute) {}

  ionViewWillEnter() {
    this.currentTab = this.activatedRoute.snapshot.firstChild?.routeConfig?.path || 'tab1';
  }
}
