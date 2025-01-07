import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from "../auth/register/register.component";
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
  itemsPerSlide = 5;
  singleSlideOffset = true;

  slides = [
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'},
      {image: '../../../assets/images/banks/bankcom.png'}
    ];

  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }

}
