import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import { DatabaseService } from '../shared/database.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IRezervacija } from '../shared/rezervacija.interface';
import { saveAs } from 'file-saver';

@Component({
    selector: "pm-dashboard",
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    constructor(public databaseService: DatabaseService, private db: AngularFirestore) { }

    HorizontalBarChartDay = [];
    HorizontalBarChartDay2 = [];

    chartGostiPoMjesecima = [];
    chartZaradaPoMjesecima = [];

    chartZaradaPoIzletuOvajMjesec = [];
    chartGostiPoIzletuOvajMjesec = [];
    chartPlatforme = [];
    chartSuradnici = [];
    chartZemlje = [];
    chartBookeri = [];
    chartVodici = [];
    chartVozaci = [];
    chartSuradnickiIzleti = [];
    chartNacinPlacanja = [];
    chartRentanaOprema = [];
    chartUdioZarade = [];

    bookeriDistinct = [];
    rijecnikDrzava: { [drzava: string]: number; } = {};
    rijecnikSMjesecima: { [mjesec: string]: IRezervacija[]; } = {};
    rijecnikIzleti: { [izlet: string]: IRezervacija[]; } = {};
    rijecnikBookeri: { [booker: string]: IRezervacija[]; } = {};
    brPariPatika;
    brPrebacaja;
    danas: Date = new Date();

    ngOnInit() {

        let dd: number = this.danas.getDate();
        let mm: number = this.danas.getMonth() + 1; //January is 0!        
        let yyyy: number = this.danas.getFullYear();
        let ddS, mmS, yyyyS: string;

        

        if (dd < 10) {
            ddS = '0' + dd;
        }
        else {
            ddS = dd;
        }
        if (mm < 10) {
            mmS = '0' + mm;
        }
        else {
            mmS = mm;
        }
        let datumFormatirano: string = ddS + "." + mmS + "." + yyyy + ".";

        //Dodavamo mjesece kao kljuceve rijecnika
        for (let index = 1; index < 13; index++) {
            this.rijecnikSMjesecima[index] = [];
        }

        let distinctIzletiOvajMjesec = [];
        let brGostijuPoIzletimaOvajMjesec = [];
        let zaradaPoIzletimaOvajMjesec = [];


        let distinctPlatforme = [];
        let distinctPlatformeBrojGostiju = [];

        let distinctSuradnici = [];
        let distinctSuradniciBrojGostiju = [];

        let distinctBookeri = [];
        let distinctBookeriBrojGostiju = [];

        let distinctVodici = [];
        let distinctVodiciBrojTura = [];

        let distinctVozaci = [];
        let distinctVozaciBrojTura = [];

        let distinctSuradnickiIzleti = [];
        let distinctSuradnickiIzletiBrojGostiju = [];

        let distinctNacinPlacanja = ["Gotovina", "Kartica"];
        let distinctNacinPlacanjaIznos = [0, 0];

        let distinctVrstaRenta = ["Ostalo", "Penjacka"];
        let distinctVrstaRentaIznos = [0, 0];

        let distinctPrihodi = ["Nasi izleti", "Suradnicki izleti", "Rent opreme", "Rent patika","Prebacaji"];
        let distinctPrihodiIznosi = [0, 0, 0, 0, 0];



        //this.databaseService.osvjeziOvogodisnjePodatke();        
        let brGostiju: number = 0;
        setTimeout(() => {
            //Dodavamo izlete kao kljuceve
            this.databaseService.podaciOvaGodina.constIzleti.forEach(element => {
                this.rijecnikIzleti[element["Naziv"]] = [];
            });

            this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
                let el: IRezervacija = element;
                //Brojanje gostiju
                brGostiju += Number(el.Gostiju);
                //Brojanje drzava
                if (el.Zemlja != null) {
                    if (this.rijecnikDrzava[el.Zemlja] == undefined) {
                        this.rijecnikDrzava[el.Zemlja] = Number(element.Gostiju);
                    }
                    else {
                        this.rijecnikDrzava[el.Zemlja] += Number(element.Gostiju);
                    }
                }

                if (distinctPlatforme.indexOf(element.Platforma) == -1 && element.Platforma != "Nema") {
                    distinctPlatforme.push(element.Platforma);
                    distinctPlatformeBrojGostiju.push(0);
                }

                if (distinctSuradnici.indexOf(element.Suradnik) == -1 && element.Suradnik != "Nema") {
                    distinctSuradnici.push(element.Suradnik);
                    distinctSuradniciBrojGostiju.push(0);
                }

                if (distinctBookeri.indexOf(element.Booker) == -1) {
                    distinctBookeri.push(element.Booker);
                    distinctBookeriBrojGostiju.push(0);
                }

                let indNacinP = distinctNacinPlacanja.indexOf(element.NacinPlacanja);
                distinctNacinPlacanjaIznos[indNacinP] += Number(element.UkupanIznos);

                //Sortiranje tura po mjesecima
                let mjesecTure = parseInt(el.Datum.split(".", 3)[1]);
                if (mjesecTure == mm && distinctIzletiOvajMjesec.indexOf(el.Izlet) == -1) {
                    distinctIzletiOvajMjesec.push(el.Izlet);
                    brGostijuPoIzletimaOvajMjesec.push(0);
                    zaradaPoIzletimaOvajMjesec.push(0);
                }

                this.rijecnikSMjesecima[mjesecTure.toString()].push(el);
                this.rijecnikIzleti[el.Izlet].push(el);
                //this.rijecnikBookeri[el.Booker].push(el);
                distinctPrihodiIznosi[0] += Number(el.IznosSuradnik) + Number(el.UkupanIznos);
            });

            this.databaseService.podaciOvaGodina.listaSvihPartnerskihIzleta.forEach(element => {
                if (distinctSuradnickiIzleti.indexOf(element.Izlet) == -1) {
                    distinctSuradnickiIzleti.push(element.Izlet);
                    distinctSuradnickiIzletiBrojGostiju.push(parseInt(element.Gostiju));
                }
                else {
                    let indIzleta = distinctSuradnickiIzleti.indexOf(element.Izlet);
                    distinctSuradnickiIzletiBrojGostiju[indIzleta] += Number(element.Gostiju);
                }

                let indNacinP = distinctNacinPlacanja.indexOf(element.NacinPlacanja);
                distinctNacinPlacanjaIznos[indNacinP] += Number(element.UkupanIznos);

                if (element.PostotakPlacenosti == "20") {
                    distinctPrihodiIznosi[1] += Number(element.UkupanIznos);
                }
                else if (element.PostotakPlacenosti == "100") {
                    if(element.Izlet=="Zipline")
                    {
                        distinctPrihodiIznosi[1] += Number(element.UkupanIznos) * 0.15;
                    }
                    else
                    {
                        distinctPrihodiIznosi[1] += Number(element.UkupanIznos) * 0.2;
                    }
                    
                }
            });

            this.databaseService.podaciOvaGodina.listaSvihRentovaOpreme.forEach(element => {
                let indNacinP = distinctNacinPlacanja.indexOf(element.NacinPlacanja);
                distinctNacinPlacanjaIznos[indNacinP] += Number(element.UkupanIznos);

                let indVrsta = distinctVrstaRenta.indexOf(element.VrstaOpreme);
                distinctVrstaRentaIznos[indVrsta] += Number(element.UkupanIznos);
                distinctPrihodiIznosi[2] += Number(element.UkupanIznos);
            });

            this.databaseService.spremljeneTure.forEach(element => {
                element.Vodici.forEach(vodic => {
                    if (distinctVodici.indexOf(vodic) == -1) {
                        distinctVodici.push(vodic);
                        distinctVodiciBrojTura.push(1);
                    }
                    else {
                        let indVodica = distinctVodici.indexOf(vodic);
                        distinctVodiciBrojTura[indVodica] += 1;
                    }
                });

                element.Vozaci.forEach(vozac => {
                    if (distinctVozaci.indexOf(vozac) == -1) {
                        distinctVozaci.push(vozac);
                        distinctVozaciBrojTura.push(1);
                    }
                    else {
                        let indVozaca = distinctVozaci.indexOf(vozac);
                        distinctVozaciBrojTura[indVozaca] += 1;
                    }
                });
            });

            let tempNizZemlja = [];
            let tempBrojGostijuZemlja = [];
            for (let key in this.rijecnikDrzava) {
                tempBrojGostijuZemlja.push(this.rijecnikDrzava[key]);
                tempNizZemlja.push(key);
            }

            $("#ispisUkupnoGostiju").text(brGostiju);
            //console.log(this.rijecnikBookeri);

            let tempBrIzletaUkupno = [];
            let tempBrGostijuDanas = [];
            let tempZaradaDanas = [];

            for (let key in this.rijecnikIzleti) {
                let value: number = 0;
                let brojacDns = 0;
                let zaradaDns = 0;

                this.rijecnikIzleti[key].forEach(element => {
                    if (element.Datum == datumFormatirano) {
                        brojacDns += Number(element.Gostiju);
                        zaradaDns += Number(element.UkupanIznos) + Number(element.IznosSuradnik);
                    }
                    value += Number(element.Gostiju);
                });
                tempBrIzletaUkupno.push(value);
                tempBrGostijuDanas.push(brojacDns);
                tempZaradaDanas.push(zaradaDns);

                // Use `key` and `value`
            }

            let nizGostijuPoMjesecima = [];
            let nizZaradePoMjesecima = [];
            for (let key in this.rijecnikSMjesecima) {

                let tempBrGostijuOvajMjesec: number = 0;
                let tempZaradaOvajMjesec: number = 0;

                this.rijecnikSMjesecima[key].forEach(element => {
                    if (Number(key) == mm) {
                        let ind = distinctIzletiOvajMjesec.indexOf(element.Izlet);
                        brGostijuPoIzletimaOvajMjesec[ind] += Number(element.Gostiju);
                        zaradaPoIzletimaOvajMjesec[ind] += Number(element.UkupanIznos) + Number(element.IznosSuradnik);
                    }
                    tempBrGostijuOvajMjesec += Number(element.Gostiju);
                    tempZaradaOvajMjesec += Number(element.UkupanIznos) + Number(element.IznosSuradnik);
                    let indPlatforme = distinctPlatforme.indexOf(element.Platforma);
                    distinctPlatformeBrojGostiju[indPlatforme] += Number(element.Gostiju);

                    let indSuradnika = distinctSuradnici.indexOf(element.Suradnik);
                    distinctSuradniciBrojGostiju[indSuradnika] += Number(element.Gostiju);

                    let indBookera = distinctBookeri.indexOf(element.Booker);
                    distinctBookeriBrojGostiju[indBookera] += Number(element.Gostiju);


                });
                nizGostijuPoMjesecima.push(tempBrGostijuOvajMjesec);
                nizZaradePoMjesecima.push(tempZaradaOvajMjesec);
            }

            this.brPariPatika = 0;
            this.databaseService.podaciOvaGodina.listaSvihRentovaPatika.forEach(element => {
                this.brPariPatika += Number(element.Kolicina);

                let indNacinP = distinctNacinPlacanja.indexOf(element.NacinPlacanja);
                distinctNacinPlacanjaIznos[indNacinP] += Number(element.UkupanIznos);

                distinctPrihodiIznosi[3] += Number(element.UkupanIznos);
            });

            this.brPrebacaja = 0;

            //PREBACAJI
            this.databaseService.podaciOvaGodina.listaSvihPrebacaja.forEach(element => {
                this.brPrebacaja += Number(element.Kolicina);

                let indNacinP = distinctNacinPlacanja.indexOf(element.NacinPlacanja);
                distinctNacinPlacanjaIznos[indNacinP] += Number(element.UkupanIznos);

                distinctPrihodiIznosi[4] += Number(element.UkupanIznos);
            });

            //console.log(this.rijecnikIzleti);
            
            this.HorizontalBarChartDay = new Chart('chartGostiPoIzletimaDanas', {
                type: 'horizontalBar',
                data: {
                    labels: Object.keys(this.rijecnikIzleti),
                    datasets: [{
                        label: 'Broj gostiju',
                        data: tempBrGostijuDanas,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po izletu",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.HorizontalBarChartDay2 = new Chart('chartZaradaPoIzletimaDanas', {
                type: 'horizontalBar',
                data: {
                    labels: Object.keys(this.rijecnikIzleti),
                    datasets: [{
                        label: 'Zarada',
                        data: tempZaradaDanas,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Zarada po izletu",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartGostiPoMjesecima = new Chart('chartGostiPoMjesecima', {
                type: 'line',
                data: {
                    labels: Object.keys(this.rijecnikSMjesecima),
                    datasets: [{
                        label: 'Broj gostiju',
                        data: nizGostijuPoMjesecima,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                        ],
                        borderColor: [
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)'
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po mjesecima",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartZaradaPoMjesecima = new Chart('chartZaradaPoMjesecima', {
                type: 'line',
                data: {
                    labels: Object.keys(this.rijecnikSMjesecima),
                    datasets: [{
                        label: 'Zarada',
                        data: nizZaradePoMjesecima,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                        ],
                        borderColor: [
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)',
                            'rgba(1, 1, 1, 1)'
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Zarada po mjesecima( samo nasi izleti i provizije su uracunate )",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartGostiPoIzletuOvajMjesec = new Chart('chartGostiPoIzletuOvajMjesec', {
                type: 'pie',
                data: {
                    labels: distinctIzletiOvajMjesec,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: brGostijuPoIzletimaOvajMjesec,
                        backgroundColor:
                            [
                                'rgba(0, 100, 255, 0.5)',
                                'rgba(129, 197, 122, 0.5)',
                                'rgba(255, 146, 51, 0.5)',
                                'rgba(41, 208, 208, 0.5)',
                                'rgba(129, 38, 192, 0.5)',
                                'rgba(157, 175, 255, 0.5)',
                                'rgba(29, 105, 20, 0.5)',
                                'rgba(87, 87, 87, 0.5)',
                                'rgba(255, 205, 243, 0.5)',
                                'rgba(129, 74, 25, 0.5)',
                                'rgba(233, 222, 187, 0.5)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(173, 35, 35, 0.5)',
                                'rgba(0, 0, 0, 0.5)',
                                'rgba(255, 238, 51, 0.5)',
                                'rgba(0, 100, 255, 0.5)',
                                'rgba(129, 197, 122, 0.5)',
                                'rgba(255, 146, 51, 0.5)',
                                'rgba(41, 208, 208, 0.5)',
                                'rgba(129, 38, 192, 0.5)',
                                'rgba(157, 175, 255, 0.5)',
                                'rgba(29, 105, 20, 0.5)',
                                'rgba(87, 87, 87, 0.5)',
                                'rgba(255, 205, 243, 0.5)',
                                'rgba(129, 74, 25, 0.5)',
                                'rgba(233, 222, 187, 0.5)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(173, 35, 35, 0.5)',
                                'rgba(0, 0, 0, 0.5)',
                                'rgba(255, 238, 51, 0.5)',
                                ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po izletima u ovom mjesecu",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }
            });

            this.chartZaradaPoIzletuOvajMjesec = new Chart('chartZaradaPoIzletuOvajMjesec', {
                type: 'pie',
                data: {
                    labels: distinctIzletiOvajMjesec,
                    datasets: [{
                        label: 'Zarada',
                        data: zaradaPoIzletimaOvajMjesec,
                        backgroundColor:
                            [
                                'rgba(0, 100, 255, 0.5)',
                                'rgba(129, 197, 122, 0.5)',
                                'rgba(255, 146, 51, 0.5)',
                                'rgba(41, 208, 208, 0.5)',
                                'rgba(129, 38, 192, 0.5)',
                                'rgba(157, 175, 255, 0.5)',
                                'rgba(29, 105, 20, 0.5)',
                                'rgba(87, 87, 87, 0.5)',
                                'rgba(255, 205, 243, 0.5)',
                                'rgba(129, 74, 25, 0.5)',
                                'rgba(233, 222, 187, 0.5)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(173, 35, 35, 0.5)',
                                'rgba(0, 0, 0, 0.5)',
                                'rgba(255, 238, 51, 0.5)',
                                'rgba(0, 100, 255, 0.5)',
                                'rgba(129, 197, 122, 0.5)',
                                'rgba(255, 146, 51, 0.5)',
                                'rgba(41, 208, 208, 0.5)',
                                'rgba(129, 38, 192, 0.5)',
                                'rgba(157, 175, 255, 0.5)',
                                'rgba(29, 105, 20, 0.5)',
                                'rgba(87, 87, 87, 0.5)',
                                'rgba(255, 205, 243, 0.5)',
                                'rgba(129, 74, 25, 0.5)',
                                'rgba(233, 222, 187, 0.5)',
                                'rgba(255, 255, 255, 0.5)',
                                'rgba(173, 35, 35, 0.5)',
                                'rgba(0, 0, 0, 0.5)',
                                'rgba(255, 238, 51, 0.5)',
                                ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Zarada po izletima u ovom mjesecu",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }
            });

            this.chartPlatforme = new Chart('chartPlatforme', {
                type: 'horizontalBar',
                data: {
                    labels: distinctPlatforme,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctPlatformeBrojGostiju,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po platformi",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartSuradnici = new Chart('chartSuradnici', {
                type: 'horizontalBar',
                data: {
                    labels: distinctSuradnici,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctSuradniciBrojGostiju,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po suradniku",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartBookeri = new Chart('chartBookeri', {
                type: 'horizontalBar',
                data: {
                    labels: distinctBookeri,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctBookeriBrojGostiju,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po bookeru",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartZemlje = new Chart('chartZemlje', {
                type: 'pie',
                data: {
                    labels: tempNizZemlja,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: tempBrojGostijuZemlja,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',

                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    legend: {
                        display: false
                     },
                    responsive: false,
                    title: {
                        text: "Broj gostiju po zemlji (Nasi izleti)",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },
                        }]
                    }
                }

            });

            this.chartVodici = new Chart('chartVodici', {
                type: 'horizontalBar',
                data: {
                    labels: distinctVodici,
                    datasets: [{
                        label: 'Broj tura',
                        data: distinctVodiciBrojTura,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj tura po vodicu",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartVozaci = new Chart('chartVozaci', {
                type: 'horizontalBar',
                data: {
                    labels: distinctVozaci,
                    datasets: [{
                        label: 'Broj tura',
                        data: distinctVozaciBrojTura,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj tura po vozacu",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    }
                }

            });

            this.chartSuradnickiIzleti = new Chart('chartSuradnickiIzleti', {
                type: 'pie',
                data: {
                    labels: distinctSuradnickiIzleti,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctSuradnickiIzletiBrojGostiju,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',

                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Broj gostiju po suradnikovom izletima",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }

            });

            this.chartNacinPlacanja = new Chart('chartNacinPlacanja', {
                type: 'pie',
                data: {
                    labels: distinctNacinPlacanja,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctNacinPlacanjaIznos,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',

                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Nacin placanja (cijelokupan promet)",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }
            });

            this.chartRentanaOprema = new Chart('chartRentanaOprema', {
                type: 'pie',
                data: {
                    labels: distinctVrstaRenta,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctVrstaRentaIznos,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',

                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Zarada po vrsti rentane opreme",

                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }
            });

            this.chartUdioZarade = new Chart('chartUdioZarade', {
                type: 'pie',
                data: {
                    labels: distinctPrihodi,
                    datasets: [{
                        label: 'Broj gostiju',
                        data: distinctPrihodiIznosi,
                        backgroundColor: [
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',
                            'rgba(0, 100, 255, 0.5)',
                            'rgba(129, 197, 122, 0.5)',
                            'rgba(255, 146, 51, 0.5)',
                            'rgba(41, 208, 208, 0.5)',
                            'rgba(129, 38, 192, 0.5)',
                            'rgba(157, 175, 255, 0.5)',
                            'rgba(29, 105, 20, 0.5)',
                            'rgba(87, 87, 87, 0.5)',
                            'rgba(255, 205, 243, 0.5)',
                            'rgba(129, 74, 25, 0.5)',
                            'rgba(233, 222, 187, 0.5)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(173, 35, 35, 0.5)',
                            'rgba(0, 0, 0, 0.5)',
                            'rgba(255, 238, 51, 0.5)',

                        ],
                        borderColor: [
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)', 
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                            'rgba(0, 0, 0, 1)',
                        ],
                        borderWidth: 1.5
                    }]
                },
                options: {
                    responsive: false,
                    title: {
                        text: "Zarada po vrsti prihoda",
                        display: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },

                        }]
                    }
                }
            });
            
            
            //this.downloadFile(this.databaseService.podaciOvaGodina.listaSvihNasihIzleta)
        }, 2500);

    }

    //DA U DATOTEKU SPREMIMO SVE PODATKE SAMO OTKOMENTIRATI LINIJU POVISE I SMANJITI GODINU I POKRENUTI 
    //i OVU LINIJU U DATABASE SERVICE         //this.podaciZaDatoteku=this.podaciOvaGodina;

    downloadFile(data: any) {
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
        csv.unshift(header.join(';'));
        let csvArray = csv.join('\r\n');

        var blob = new Blob([csvArray], {type: 'text/csv' })
        let fileName="AdventureOmis.csv";
        saveAs(blob,fileName);
    }
}