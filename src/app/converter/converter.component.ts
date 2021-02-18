import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as jsPDF from 'jspdf'
import { CurrencyConverterService } from '../shared/currencyConverter.service';
import { TouchSequence } from 'selenium-webdriver';
import { DatabaseService } from '../shared/database.service';


@Component({
    selector: "pm-converter",
    templateUrl: './converter.component.html',
    styleUrls: ['./converter.component.css']
})

export class ConverterComponent implements OnInit {
    lista = [];

    temp: any = [];
    constructor(
        private currencyService: CurrencyConverterService,
        public databaseService: DatabaseService) { }

    ngOnInit() {
        this.currencyService.getValues().subscribe(
            products => {

                //Dodavanje nazive valuta i
                this.temp = products;
                this.lista.push({ Valuta: "AUD", VrijednostUHRK: this.temp.rates.AUD, PuniNaziv: "Australski dolar" });
                this.lista.push({ Valuta: "CAD", VrijednostUHRK: this.temp.rates.CAD, PuniNaziv: "Kanadski dolar" });
                this.lista.push({ Valuta: "CHF", VrijednostUHRK: this.temp.rates.CHF, PuniNaziv: "Švicarski franak" });
                this.lista.push({ Valuta: "CZK", VrijednostUHRK: this.temp.rates.CZK, PuniNaziv: "Česka kruna" });
                this.lista.push({ Valuta: "EUR", VrijednostUHRK: this.temp.rates.EUR, PuniNaziv: "Euro" });
                this.lista.push({ Valuta: "GBP", VrijednostUHRK: this.temp.rates.GBP, PuniNaziv: "Britanska funta" });
                this.lista.push({ Valuta: "HRK", VrijednostUHRK: this.temp.rates.HRK, PuniNaziv: "Hrvatska kuna" });
                this.lista.push({ Valuta: "HUF", VrijednostUHRK: this.temp.rates.HUF, PuniNaziv: "Mađarska forinta" });
                this.lista.push({ Valuta: "PLN", VrijednostUHRK: this.temp.rates.PLN, PuniNaziv: "Poljski zlot" });
                this.lista.push({ Valuta: "USD", VrijednostUHRK: this.temp.rates.USD, PuniNaziv: "Američki dolar" });
                //console.log(this.lista);
                $("#unos2Iznosa").val((this.temp.rates.HRK/this.temp.rates.EUR).toFixed(2));

            },
            error => alert(error)
        );
        $("#unosIznosa").val(1);

        setTimeout(function () {
            $("#prvaValuta").val("EUR");
            $("#drugaValuta").val("HRK");
        },500);


    }

    osvjezi() {
        let valuta1 = $("#prvaValuta").val();
        let valuta2 = $("#drugaValuta").val();

        let vrijednost1, vrijednost2;


        this.lista.forEach(element => {
            if (element.Valuta == valuta1) {
                vrijednost1 = element.VrijednostUHRK;
            }

            if (element.Valuta == valuta2) {
                vrijednost2 = element.VrijednostUHRK;
            }
        });
        //console.log("VR1: " + vrijednost1);
        //console.log("VR2: " + vrijednost2);
        let omjer: number = vrijednost2 / vrijednost1;
        //console.log("OMJER: " + omjer);
        let unos = $("#unosIznosa").val();
        $("#unos2Iznosa").val((unos * omjer).toFixed(2));
    }

    zamijeniValute() {
        let valuta1 = $("#prvaValuta").val();
        let valuta2 = $("#drugaValuta").val();

        $("#prvaValuta").val(valuta2);
        $("#drugaValuta").val(valuta1);

        this.osvjezi();
    }
}