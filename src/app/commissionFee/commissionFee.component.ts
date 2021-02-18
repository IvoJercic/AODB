import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: "pm-commissionFee",
    templateUrl: './commissionFee.component.html',
    styleUrls: ['./commissionFee.component.css']
})


export class CommissionFeeComponent implements OnInit {
    rijecnik: { [imeSuradnika: string]: Object[]; } = {};
    rijecnikSMjesecima: { [imeSuradnika: string]: Object[]; } = {};
    odabranielementRijecnika;

    constructor(private modalService: NgbModal,
        private router: Router,
        public databaseService: DatabaseService) { }

    ngOnInit() {
        //Sakrit cemo sve tablice sa podacima

        this.databaseService.podaciOvaGodina.constPartneri.forEach(element => {
            this.rijecnik[element.Naziv] = [];
            this.rijecnikSMjesecima[element.Naziv] = [];
            $("#div" + element.Naziv).hide();
        });

        
        
        this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
            if (element.Suradnik != "Nema" ) {
                //Vrijednost rijecnika je niz koji sadrzi sve grupe koje je poslao taj suradnik
                this.rijecnik[element.Suradnik].push(element);
            }
        });

        //Za svakog suradnika radimo razvrstavanje grupa koje je on poslao po mjesecima
        this.databaseService.podaciOvaGodina.constPartneri.forEach(element => {
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

    otvoriSveGrupeMjesecaZaSuradnika(content, podaci: Object, suradnik: string) {
        this.odabranielementRijecnika = podaci;
        this.modalService.open(content, { size: 'lg', windowClass: 'modal-dialog-centered', centered: true });
        $("#naslovModala").text(suradnik + " - " + podaci["Mjesec"] + ". mjesec");

        this.odabranielementRijecnika.Grupe.sort((a, b) => (a.RedniBroj > b.RedniBroj) ? -1 : 1);        

        let suma = 0;
        let gostiju = 0;
        podaci["Grupe"].forEach(element => {
            suma += element.IznosSuradnik;
            gostiju += parseInt(element.Gostiju);
        });
        $("#suradnikovaRazlikaMjesec").text(suma);
        $("#suradnikovihGostijuMjesec").text(gostiju);
    }

    preokreniPopis(id: string) {
        let puniId = "#div" + id;
        $(puniId).toggle(250);
    }
}