import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: "pm-employees",
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css']
})

export class EmployeesComponent implements OnInit {
    constructor(private modalService: NgbModal,
        private router: Router,
        public databaseService: DatabaseService) { }

    promatranaTura;
    rijecnik: { [imeZaposlenika: string]: Object[]; } = {};
    promatraniRadnik;
    ngOnInit() {
        //Stvaramo rijecnik gdje je kljuc ime osobe a vrijednost su IDOVI ture

        this.databaseService.podaciOvaGodina.constVodici.forEach(element => {
            this.rijecnik[element.Ime] = [];
        });

        this.databaseService.podaciOvaGodina.constVozaci.forEach(element => {
            this.rijecnik[element.Ime] = [];
        });


        this.databaseService.spremljeneTure.forEach(element => {
            if (element.NizNeplacenihRadnika.length > 0) {
                //Ako ima netko da ga nismo platili provrtimo taj niz
                element.NizNeplacenihRadnika.forEach(element2 => {
                    this.rijecnik[element2].push(element);
                });
            }
        });
        //Ovdje imamo rijecnik (osoba,nizNeplacenih tura)
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    otvoriIzbornikPlacanja(content, tura: Object, radnik: string) {
        this.otvoriModalBox(content);
        this.promatranaTura=tura;
        this.promatraniRadnik=radnik;
        $("#naslovModala").text(radnik);
        $("#lblDatumTure").val(tura["Datum"]);
        $("#lblVrijemeTure").val(tura["Vrijeme"]);
        $("#lblIzletTure").val(tura["Izlet"]);
        $("#lblRedni").val(tura["RedniBroj"]);
        $("#unosIznosaRacun").val(0);
        $("#unosIznosaGotovina").val(0);


        let temp="";
        tura["Vodici"].forEach(element => {
            temp+=element+"\n";
        });
        $("#vodiciNaTuri").text(temp);

        temp="";

        tura["Vozaci"].forEach(element => {
            temp+=element+"\n";
        });

        $("#vozaciNaTuri").text(temp);

    }

    potvrdiPlacanjeRadnik(){
        if($("#unosIznosaRacun").val()>0 || $("#unosIznosaGotovina").val()>0){
            var r = confirm("Radniku " + this.promatraniRadnik + " platili ste ukupno " + (parseInt($("#unosIznosaRacun").val())+parseInt($("#unosIznosaGotovina").val())) + " HRK.\nZelite li ovo pohraniti u bazu podataka?");
            if (r == true) {
                this.databaseService.platiRadnika(this.promatranaTura,this.promatraniRadnik,$("#unosIznosaGotovina").val(),$("#unosIznosaRacun").val());
                alert("Promjena uspjesno spremljena !");
                this.modalService.dismissAll();
                //this.router.navigate(["/dashboard"]);
                setTimeout(() => {
                    this.ngOnInit();
                }, 1000);
    
            }    
        }
        else{
            alert("Unesite iznos koji zelite platiti !");
        }
    }
}

