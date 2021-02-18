import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
//Za dodavanje modalBoxa
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Firebase
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

//Moje komponente
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookTripComponent } from './bookTrip/bookTrip.component';
import { RentEquipComponent } from './rentEquip/rentEquip.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { BookTripForOthersComponent } from './bookTripForOthers/bookTripForOthers.component';
import { RentShoesComponent } from './rentShoes/rentShoes.component';
import { ConverterComponent } from './converter/converter.component';
import { HttpClientModule } from '@angular/common/http';
import { DataInputToDBComponent } from './dataInputToDB/dataInputToDB.component';
import { TodayComponent } from './today/today.component';
import { EmployeesComponent } from './employees/employees.component';
import { CommissionFeeComponent } from './commissionFee/commissionFee.component';
import { AllGroupsComponent } from './allGroups/allGroups.component';
import { AllRentsComponent } from './allRents/allRents.component';
import { AllPartnersTripsComponent } from './allPartnersTrips/allPartnersTrips.component';
import { BasicToAdvancedComponent } from './basicToAdvanced/basicToAdvanced.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BookTripComponent,
    RentEquipComponent,
    BookTripForOthersComponent,
    RentShoesComponent,
    ConverterComponent,
    DataInputToDBComponent,
    TodayComponent,
    EmployeesComponent,
    CommissionFeeComponent,
    AllGroupsComponent,
    AllRentsComponent,
    AllPartnersTripsComponent,
    BasicToAdvancedComponent,

    CalendarComponent,
    DashboardComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "login", component: LoginComponent },
      { path: "dashboard", component: DashboardComponent },
      { path: "bookTrip", component: BookTripComponent },
      { path: "rentEquip", component: RentEquipComponent },
      { path: "calendar", component: CalendarComponent },
      { path: "bookTripForOthers", component: BookTripForOthersComponent },
      { path: "rentShoes", component: RentShoesComponent },
      { path: "converter", component: ConverterComponent },
      { path: "dataInputToDB", component: DataInputToDBComponent },
      { path: "today", component: TodayComponent },
      { path: "employees", component: EmployeesComponent },
      { path: "commissionFee", component: CommissionFeeComponent },
      { path: "allGroups", component: AllGroupsComponent },
      { path: "allRents", component: AllRentsComponent },
      { path: "allPartnersTrips", component: AllPartnersTripsComponent },
      { path: "basicToAdvanced", component: BasicToAdvancedComponent }

    ]),
    AngularFireModule.initializeApp(environment.firebase, 'aodb2019'),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgbModule,
    HttpClientModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
