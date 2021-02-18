import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import * as jsPDF from 'jspdf'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
    selector: "pm-rentShoes",
    templateUrl: './rentShoes.component.html',
    styleUrls: ['../bookTrip/bookTrip.component.css']
})

export class RentShoesComponent implements OnInit {

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

    cijenaPatika: number;//Promjeni vrijednost u ngOnInit

    ngOnInit() {
        this.cijenaPatika = 35;
        this.booker = "Ivica Beovic";
    }

    osvjeziCijenu() {
        this.placeno = $("#placenoUnos").val();
        this.kolicina = $("#kolicinaUnos").val();
        this.ukupno = this.kolicina * this.cijenaPatika;
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
            this.listaKardinalnihGresaka.push("Kolicina patika");
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
            RedniBroj: this.databaseService.indeksPatika+1,
            Datum: this.datum,
            NacinPlacanja: this.nacinPlacanja,
            UkupanIznos: this.ukupno,
            Placeno: this.placeno,
            ZaPlatiti: this.zaPlatiti,
            Kolicina:this.kolicina
        }
        this.databaseService.spremiPatikeUBazu(rezervacija,this.databaseService.indeksPatika);
        this.router.navigate(["/dashboard"]);
    }
}
