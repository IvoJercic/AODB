import { Component } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AO';
  subscription: any;
  constructor(private router: Router, ) {

  }

  ngOnInit() {
    //TESTIRAMO MANJI PROMET
    // //Ovde s ifom rjesit da se ne pribacuje na login bzvz
    // if(localStorage.getItem("user")==null){
    //   this.router.navigate(["/login"]);
    // }
    // else 
    // {
    //   this.router.navigate(["/dashboard"]);
    // }

    this.router.navigate(["/login"]);

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
