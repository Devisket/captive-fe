import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  footerTitle: number = 2024;
  currentYear: number = new Date().getFullYear();
  yearString: string = "";

  ngOnInit(): void {
    this.title();
  }

  title(){
    if(this.footerTitle == this.currentYear){
      this.yearString = this.footerTitle + ' - ' + this.currentYear;
    }
  }
  
}
