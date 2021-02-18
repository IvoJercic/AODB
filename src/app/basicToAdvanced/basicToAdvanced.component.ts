import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import * as jsPDF from 'jspdf'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
    selector: "pm-basicToAdvanced",
    templateUrl: './basicToAdvanced.component.html',
    styleUrls: ['../bookTrip/bookTrip.component.css']
})

export class BasicToAdvancedComponent implements OnInit {

    constructor(public modalService: NgbModal,
        private router: Router,
        public databaseService: DatabaseService) { }

    listaKardinalnihGresaka = [];

    ukupno: number;
    placeno: number;
    zaPlatiti: number;
    booker: string;
    kolicina: number;
    nacinPlacanja: string;
    datum: string;

    cijenaPrebacaja: number;//Promjeni vrijednost u ngOnInit

    ngOnInit() {
        this.cijenaPrebacaja = 100;
        this.booker = "Ivica Beovic";
    }

    osvjeziCijenu() {
        this.placeno = $("#placenoUnos").val();
        this.kolicina = $("#kolicinaUnos").val();
        this.ukupno = this.kolicina * this.cijenaPrebacaja;
        $("#zaPlatitiUnos").val(this.ukupno - this.placeno);
    }

    formatirajDatum(dateStr: string) {
        let dArr: string[] = dateStr.split("-");  // ex input "2010-01-18"
        return dArr[2] + "." + dArr[1] + "." + dArr[0] + "."; //ex out: "18/01/10"
    }
    
    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    potvrdiUnos(content) {
        this.listaKardinalnihGresaka = [];
        this.ukupno = $("#ukupnoUnos").val();
        this.placeno = $("#placenoUnos").val();
        this.zaPlatiti = $("#zaPlatitiUnos").val();
        this.kolicina = $("#kolicinaUnos").val();
        this.datum = this.formatirajDatum($("#datumUnos").val());

        //Pridruzivanje vrijednosti varijabli vrstaPlacanja        
        if ($('#gotovina').is(':checked')) {
            this.nacinPlacanja = "Gotovina";
        }
        else {
            this.nacinPlacanja = "Kartica";
        }

        let sumaProvjera = 0;
        if (this.datum.indexOf("undefined") && this.datum != null) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Datum");
        }

        if (this.kolicina > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Broj prebacaja");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 2) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaObicnihGresaka").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            //console.log("SVE OBAVEZNO ISPUNJENO");
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li spremiti unos ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    zavrsniSUnosom() {
        this.modalService.dismissAll();
        var rezervacija: object = {
            RedniBroj: this.databaseService.indeksPrebacaja+1,
            Datum: this.datum,
            NacinPlacanja: this.nacinPlacanja,
            UkupanIznos: this.ukupno,
            Placeno: this.placeno,
            ZaPlatiti: this.zaPlatiti,
            Kolicina:this.kolicina
        }
        this.databaseService.spremiPrebacajUBazu(rezervacija,this.databaseService.indeksPrebacaja);
        this.router.navigate(["/dashboard"]);
    }
}
