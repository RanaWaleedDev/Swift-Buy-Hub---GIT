import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carosalslider',
  templateUrl: './carosalslider.component.html',
  styleUrls: ['./carosalslider.component.css']
})
export class CarosalsliderComponent  implements OnInit{
  constructor() { }

  ngOnInit(): void {
    // Automatically scroll to the next slide after 5 seconds
    setTimeout(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    const nextButton = document.querySelector('.carousel-control-next');
    if (nextButton) {
      nextButton.dispatchEvent(new Event('click'));
      // Recursive call to continue auto-scrolling
      this.ngOnInit();
    }
  }
  

}
