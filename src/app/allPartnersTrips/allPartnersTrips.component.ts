import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRezervacija } from '../shared/rezervacija.interface';

@Component({
    selector: "pm-allPartnersTrips",
    templateUrl: './allPartnersTrips.component.html',
    styleUrls: ['./allPartnersTrips.component.css']
})


export class AllPartnersTripsComponent implements OnInit {
    promatraniIzlet: IRezervacija;
    rijecnik: { [imeIzleta: string]: Object[]; } = {};
    rijecnikSMjesecima: { [imeSuradnika: string]: Object[]; } = {};
    odabranaListaIzleta;

    brGostijuPoMjesecima;


    constructor(private modalService: NgbModal,
        public databaseService: DatabaseService) { }

    ngOnInit() {
        this.databaseService.podaciOvaGodina.listaSvihPartnerskihIzleta.sort((a, b) => (a.RedniBroj > b.RedniBroj) ? -1 : 1);

        this.databaseService.podaciOvaGodina.constPartnerskiIzleti.forEach(element => {
            this.rijecnik[element.Naziv] = [];
            this.rijecnikSMjesecima[element.Naziv] = [];
        });

        this.databaseService.podaciOvaGodina.listaSvihPartnerskihIzleta.forEach(element => {
            this.rijecnik[element.Izlet].push(element);
        });


        //Za svakog suradnika radimo razvrstavanje grupa koje je on poslao po mjesecima
        this.databaseService.podaciOvaGodina.constPartnerskiIzleti.forEach(element => {
            let nizSaMjesecima = [];
            let miseci = [];

            if (this.rijecnik[element.Naziv] != undefined) {
                this.rijecnik[element.Naziv].forEach(element2 => {
                    let objekt = { Mjesec: 0, Grupe: [] };
                    let splitted = element2["Datum"].split(".");
                    let mjesec = parseInt(splitted[1]);
                    if (miseci.indexOf(mjesec) == -1) {
                        miseci.push(mjesec);
                        objekt.Mjesec = mjesec;
                        objekt.Grupe.push(element2);
                        nizSaMjesecima.push(objekt);
                    }
                    else {
                        nizSaMjesecima.forEach(element3 => {
                            if (element3["Mjesec"] == mjesec) {
                                let ind = nizSaMjesecima.indexOf(element3);
                                nizSaMjesecima[ind]["Grupe"].push(element2);
                            }
                        });
                    }
                });
                this.rijecnikSMjesecima[element.Naziv] = nizSaMjesecima;
            }
        });
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    prikazDetaljaSuradnikovaIzleta(content, izlet: Object) {
        this.otvoriModalBox(content);
        $("#brojSuradnikovaIzleta").text("Izlet #" + izlet["RedniBroj"]);

        $("#lbl3Datum").val(izlet["Datum"]);
        $("#lbl3Vrijeme").val(izlet["Vrijeme"]);
        $("#lbl3Izlet").val(izlet["Izlet"]);
        $("#lbl3Odrasli").val(izlet["Gostiju"]);
        $("#lbl3Djeca").val(izlet["BrojDjece"]);
        $("#lbl3Predstavnik").val(izlet["Predstavnik"]);
        $("#lbl3Zemlja").val(izlet["Zemlja"]);
        $("#lbl3Nacin").val(izlet["NacinPlacanja"]);
        $("#lbl3Email").val(izlet["Email"]);
        $("#lbl3Kontakt").val(izlet["Kontakt"]);
        $("#lbl3Ukupno").val(izlet["UkupanIznos"]);
        $("#lbl3Placeno").val(izlet["Placeno"]);
        $("#lbl3Platiti").val(izlet["ZaPlatiti"]);
        $("#lbl3Napomena").val(izlet["Napomena"]);
        $("#lbl3Booker").val(izlet["Booker"]);
    }

    sazetakOIzletu(content2, izlet: string, listaIzleta: Object) {
        this.brGostijuPoMjesecima = [];
        let nizMjeseca = [];
        this.odabranaListaIzleta = this.rijecnikSMjesecima[izlet];
        let nizPlusMinusa=[];
        let nizUkupno=[];
        
        for (let key in this.odabranaListaIzleta) {
            let brGostiju = 0;
            let tempBrojac:number=0;
            let suma:number=0;
            nizMjeseca.push(this.odabranaListaIzleta[key].Mjesec);
            
            
            this.odabranaListaIzleta[key].Grupe.forEach(element => {
                if(element.PostotakPlacenosti=="100")
                {
                    if(element.Izlet=="Zipline")
                    {
                        tempBrojac+=(parseInt(element.UkupanIznos)*0.85);         
                    }
                    else
                    {

                        //80% moramo dati partneru
                        tempBrojac+=(parseInt(element.UkupanIznos)*0.8);         
                    }
                }
                brGostiju = brGostiju + parseInt(element.Gostiju);
                suma+=parseInt(element.UkupanIznos);           
                
            });            
            this.brGostijuPoMjesecima.push(brGostiju);            
            nizPlusMinusa.push(tempBrojac);
            nizUkupno.push(suma);
        }
        
        setTimeout(() => {
            for (let index = 0; index < nizMjeseca.length; index++) {
                let temp = nizMjeseca[index];
                $('input[id=tdBrGostiju' + temp + ']').val(this.brGostijuPoMjesecima[index]);                
                $('input[id=tdRazlika' + temp + ']').val(nizPlusMinusa[index]);
                $('input[id=tdUkupno' + temp + ']').val(nizUkupno[index]);
            }
            
        }, 100);

        this.otvoriModalBox(content2);
        $("#nazivSuradnika").text(izlet);
    }

    izbrisiSuradnickiIzlet(izlet:Object){
        var r = confirm("Ovime cete suradnikov izlet #"+ izlet["RedniBroj"] +" trajno izbrisati. \nZelite li ovo? ");
        if (r == true) {
            this.databaseService.izbrisiSuradnikovIzlet(izlet);
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        } 
    }
}

