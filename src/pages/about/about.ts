import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit{

  constructor(
    public navCtrl: NavController,
    public navParams:NavParams
  ) {

  }

  ngOnInit(){  }
  

}
