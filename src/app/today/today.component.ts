import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IRezervacija } from '../shared/rezervacija.interface';
import datetimeDifference from "datetime-difference";
declare var require: any

@Component({
    selector: "pm-today",
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.css']
})

export class TodayComponent implements OnInit {
    constructor(private modalService: NgbModal,
        private router: Router,
        public databaseService: DatabaseService) { }

    datumFormatirano: string;
    tureDanas = [];
    nevraceniRent = [];
    promatranaGrupa: IRezervacija;
    promatraniRent: Object;
    idPromatranogRenta: number;
    potpisPromatraneTure: string;
    showComponent: boolean = true;
    ukupnoTuraDanas = 0;
    vodiciZaSpremljenuTuru = [];
    vozaciZaSpremljenuTuru = [];


    ngOnInit() {
        this.ukupnoTuraDanas = 0;
        let danas: Date = new Date();
        let dd: number = danas.getDate();
        let mm: number = danas.getMonth() + 1; //January is 0!        
        let yyyy: number = danas.getFullYear();

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

        this.datumFormatirano = ddS + "." + mmS + "." + yyyy + ".";
        //this.databaseService.osvjeziOvogodisnjePodatke(); //DA MANJE TROSI
        this.tureDanas = [];
        this.nevraceniRent = [];


        let tempRijecnik = this.databaseService.dohvatiTureNaDaniDatum(this.datumFormatirano);

        for (let kljuc in tempRijecnik) {
            let splitted = kljuc.split(" ", 10);

            //splitamo potpis funkcije(datum vrijeme tipIzleta po razmacima koji ovise o korisnikovom unosu, pretpostavimo da korisnik nece unositi preeduge rijeci izleta pa ni potpisi nece sadrzavati vise od 10 spaceva po kojima razbijamo string)
            let tempKljuc = "";
            for (let index = 1; index < 9; index++) {
                if (splitted[index] != undefined) {
                    tempKljuc += splitted[index] + " ";
                }
            }
            this.ukupnoTuraDanas++;
            //Funkcija dohvatiTureNaDaniDatum vraca objekt a moramo to pohraniti kao niz kako bi mogli koristit ngFor            
            this.tureDanas.push({ PotpisIzleta: kljuc, IDBotuna: "save" + this.ukupnoTuraDanas, SkraceniPotpis: tempKljuc, Gostiju: tempRijecnik[kljuc], Grupe: [] });
            //console.log(kljuc+" "+tempRijecnik[kljuc]);

            //console.log(this.tureDanas);
        }

        //Dohvacamo sve grupe unutar dane ture
        this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
            if (Object(element["Datum"]) == this.datumFormatirano) {
                //Ako je neka grupa rezervirana na danasnji datum tada vrtimo sve ture kako bi pomocu potpisa izleta zakljucili kojoj turi pripadaju
                for (let index = 0; index < this.tureDanas.length; index++) {
                    if (this.tureDanas[index].PotpisIzleta == this.izradiPotpisIzleta(element)) {
                        this.tureDanas[index].Grupe.push(element);
                        // console.log(this.tureDanas[index].PotpisIzleta+" "+ this.tureDanas[index].Grupe);
                    }
                }
            }
        });

        $("#izletiDanas").hide();
        $("#opremaDanas").hide();
        this.nevraceniRent = this.databaseService.dohvatiNevraceniRent();

        setTimeout(() => {
            this.sakrijIkoneSpremljenihTura();
            this.obojajRedove();
        }, 1);
    }

    obojajRedove() {
        //Zelimo red obojati u zeleno za grupe gdje su gosti dosli
        this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
            let grupa: IRezervacija = element;

            if (grupa.GostiDosli == true) {
                $("#trGrupa" + grupa.RedniBroj).removeClass("gostiKojiNisuDosli").addClass("bg-success");
            }
        });
    }

    izradiPotpisIzleta(izlet: Object): string {
        return Object(izlet["Datum"]) + " " + Object(izlet["Vrijeme"]) + " " + Object(izlet["Izlet"]);
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    prikazDetaljaGrupe(content, idGrupe: number) {
        this.otvoriModalBox(content);

        //Izvlacenje izleta koji ima isti id
        this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
            if (element.RedniBroj == idGrupe) {
                this.promatranaGrupa = element;
            }
        });

        $("#lblDatum").val(this.promatranaGrupa.Datum);
        $("#lblVrijeme").val(this.promatranaGrupa.Vrijeme);
        $("#lblMjesto").val(this.promatranaGrupa.MjestoSusreta);
        $("#lblVrsta").val(this.promatranaGrupa.Izlet);
        $("#lblPredstavnik").val(this.promatranaGrupa.Predstavnik);
        $("#lblVelicina").val(this.promatranaGrupa.Gostiju);
        $("#lblPrivatna").val(this.promatranaGrupa.PrivatnaTura);
        $("#lblZemlja").val(this.promatranaGrupa.Zemlja);
        $("#lblSuradnik").val(this.promatranaGrupa.Suradnik);
        $("#lblPlatforma").val(this.promatranaGrupa.Platforma);
        $("#lblEmail").val(this.promatranaGrupa.Email);
        $("#lblKontakt").val(this.promatranaGrupa.Kontakt);
        $("#lblUkupno").val(this.promatranaGrupa.UkupanIznos);
        $("#lblPlaceno").val(this.promatranaGrupa.Placeno);
        $("#lblPlatiti").val(this.promatranaGrupa.ZaPlatiti);
        $("#lblNapomena").val(this.promatranaGrupa.Napomena);        
        $("#lblBooker").val(this.promatranaGrupa.Booker);

        if (this.promatranaGrupa.GostiDosli == true) {
            $('#btnPotvrdiGrupu').hide();
            $('#btnOdustaniGrupu').hide();
        }
        else {
            $('#btnPotvrdiGrupu').show();
            $('#btnOdustaniGrupu').show();
        }
    }

    potvrdiGrupu() {
        var r = confirm("Grupa #" + this.promatranaGrupa.RedniBroj + " je platila sve troskove za " + this.izradiPotpisIzleta(this.promatranaGrupa) + ". \nZelite li ovo pohraniti u bazu podataka?");
        if (r == true) {
            this.databaseService.azurirajIzlet(this.promatranaGrupa);
            this.modalService.dismissAll('Cross click')
            //this.databaseService.osvjeziOvogodisnjePodatke();
            // setTimeout(() => {           
            //     this.databaseService.dohvatiTureNaDaniDatum(this.datumFormatirano);
            //     this.obojajRedove();    
            //     $("#tdPlaceno"+this.promatranaGrupa.RedniBroj).text(this.promatranaGrupa.UkupanIznos);
            //     $("#tdPlatiti"+this.promatranaGrupa.RedniBroj).text("0");
            // }, 3000);
            //this.router.navigate(["/dashboard"]);
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        }
    }

    otkaziGrupu() {
        var r = confirm("Ovime cete otkazati grupu #" + this.promatranaGrupa.RedniBroj + " za " + this.izradiPotpisIzleta(this.promatranaGrupa) + " te ce se grupa prebaciti u arhivu. \nZelite li ovo?");
        if (r == true) {
            this.modalService.dismissAll('Cross click');

            this.databaseService.arhivirajGrupu(this.promatranaGrupa);
            alert("Tura " + this.promatranaGrupa.RedniBroj + " uspjesno spremljena u arhivu !");
            // setTimeout(() => {                
            //     this.tureDanas = [];
            //     this.ngOnInit();
            // }, 3000);
            //this.router.navigate(["/dashboard"]);
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);

            //Da budem siguran da ce sve bit dobro vracam korisnike na dashboard i kupujem vrijeme za proces u pozadini koji radi s bazom podataka
        }
    }

    spremiTuru(content2, potpisIzleta: string) {
        this.potpisPromatraneTure = potpisIzleta;
        //console.log(potpisIzleta);
        this.otvoriModalBox(content2);

        let ukupnoGrupa: number = 0;
        let ukupnoGostiju: number = 0;
        let zaPlatiti: number = 0;
        let ukupno: number = 0;
        let placeno: number = 0;


        let datum, vrijeme, izlet: string;
        //U nizu ture danas imamo sve ture na danasnji dan zajedno sa grupama koje cine tu turu
        let dolazakGostiju = true;
        this.tureDanas.forEach(tura => {
            if (tura.PotpisIzleta == potpisIzleta) {
                ukupnoGrupa = tura.Grupe.length;
                //tura je nasa tura koja odgovara proslijedenom parametru potpis izleta
                tura.Grupe.forEach(grupa => {
                    let temp: IRezervacija = grupa;
                    datum = temp.Datum;
                    vrijeme = temp.Vrijeme;
                    izlet = temp.Izlet;
                    placeno += Number(temp.Placeno);
                    zaPlatiti += Number(temp.ZaPlatiti);
                    ukupno += Number(temp.UkupanIznos);
                    ukupnoGostiju += Number(temp.Gostiju);
                    //Dosta je da jedna grupa nije dosla, vrijednost ove var ce biti false
                    if (temp.GostiDosli == false) {
                        dolazakGostiju = false;
                    }
                });
            }
        });

        $("#lblDatumTure").val(datum);
        $("#lblVrijemeTure").val(vrijeme);
        $("#lblIzletTure").val(izlet);
        $("#lblBrojGrupaTure").val(ukupnoGrupa);
        $("#lblBrojGostijuTure").val(ukupnoGostiju);
        $("#lblUkupanIznosTure").val(ukupno);
        $("#lblPlacenoTure").val(placeno);
        $("#lblZaPlatitiTure").val(zaPlatiti);
        $("#lblGostiDosliTure").val(dolazakGostiju);
    }

    potvrdiSpremanjeTure() {
        let datum: string;
        let vrijeme: string;
        let izlet: string;
        let ukupnoGrupa: number = 0;
        let ukupno: number = 0;
        let ukupnoGostiju: number = 0;
        let brojeviGrupaUOvojTuri = [];
        let nizVozaca = [];
        let nizVodica = [];

        //console.log(this.databaseService.tempconstVodici);

        //Spremanje checkiraih vodica u niz
        this.databaseService.tempconstVodici.forEach(element => {
            let tempIme = "#cBox" + element.Ime;
            if ($(tempIme).is(':checked')) {
                nizVodica.push(element.Ime);
            }
        });

        //Spremanje checkiraih vozaca u niz
        this.databaseService.tempconstVozaci.forEach(element => {
            let tempIme = "#cBox" + element.Ime;
            if ($(tempIme).is(':checked')) {
                nizVozaca.push(element.Ime);
            }
        });


        //Trazimo turu s potpisom izleta kojeg smo dobili iz kliknutog botuna spremanja
        this.tureDanas.forEach(tura => {
            if (tura.PotpisIzleta == this.potpisPromatraneTure) {
                ukupnoGrupa = tura.Grupe.length;
                //tura je nasa tura koja odgovara proslijedenom parametru potpis izleta
                tura.Grupe.forEach(grupa => {
                    let temp: IRezervacija = grupa;
                    brojeviGrupaUOvojTuri.push(temp.RedniBroj);
                    datum = temp.Datum;
                    vrijeme = temp.Vrijeme;
                    izlet = temp.Izlet;
                    ukupno += Number(temp.UkupanIznos);
                    ukupnoGostiju += Number(temp.Gostiju);
                });
            }
        });

        if ($("#lblGostiDosliTure").val() == "false") {
            alert("Nije moguce spremiti turu dok svi gosti ne dodu !");
            return;
        }

        let nizNeplacenih=[];
        nizVozaca.forEach(element => {
            nizNeplacenih.push(element)
        });

        nizVodica.forEach(element => {
            nizNeplacenih.push(element)
        });
        let temp2: object = {
            RedniBroj: this.databaseService.indeksTura + 1,
            PotpisTure: this.potpisPromatraneTure,
            Datum: datum,
            Vrijeme: vrijeme,
            Izlet: izlet,
            BrojGostiju: ukupnoGostiju,
            BrojGrupa: ukupnoGrupa,
            UkupanIznos: ukupno,
            Vodici: nizVodica,
            Vozaci: nizVozaca,
            NizNeplacenihRadnika:nizNeplacenih,
            IDoviGrupa: brojeviGrupaUOvojTuri
        };

        var r = confirm("Zelite li turu #" + this.databaseService.indeksTura + " pohraniti u bazu podataka?");
        if (r == true) {
            this.databaseService.spremiTuruUBazu(temp2, this.databaseService.indeksTura);
            this.modalService.dismissAll('Cross click');
            //this.router.navigate(["/dashboard"]);
            setTimeout(() => {
                this.ngOnInit();

            }, 1000);

        }

    }

    sakrijIkoneSpremljenihTura() {
        this.tureDanas.forEach(element => {
            //Za svaku danasnju turu provjeravamo jeli spremljena
            this.databaseService.spremljeneTure.forEach(element2 => {
                //Ako je tura spremljena sakrij botun za spremanje
                if (element2.PotpisTure == element.PotpisIzleta) {
                    $("#" + element.IDBotuna).hide();
                }
            });
        });
    }

    detaljiTure(content3, potpisIzleta: string) {
        this.potpisPromatraneTure = potpisIzleta;
        //console.log(potpisIzleta);
        this.otvoriModalBox(content3);
        let signal = false;
        this.databaseService.spremljeneTure.forEach(element => {
            if (element.PotpisTure == potpisIzleta) {
                signal = true;
                $("#lbl2DatumTure").val(element.Datum);
                $("#lbl2VrijemeTure").val(element.Vrijeme);
                $("#lbl2IzletTure").val(element.Izlet);
                $("#lbl2BrojGrupaTure").val(element.BrojGrupa);
                $("#lbl2BrojGostijuTure").val(element.BrojGostiju);
                $("#lbl2UkupanIznosTure").val(element.UkupanIznos);
                $("#naslovTure").text("Tura #" + element.RedniBroj);
                this.vodiciZaSpremljenuTuru = element.Vodici;
                this.vozaciZaSpremljenuTuru = element.Vozaci;
            }
        });

        if (signal == false) {
            alert("Ta tura nije spremljena !\nDa biste vidjeli informacije potrebno je spremiti turu.");
            this.modalService.dismissAll()
        }
    }

    toggleIzleti() {
        $("#izletiDanas").toggle(250);
    }

    toggleOprema() {
        $("#opremaDanas").toggle(250);
    }

    prikazDetaljaRenta(content, id: number) {
        this.otvoriModalBox(content);
        this.databaseService.podaciOvaGodina.listaSvihRentovaOpreme.forEach(element => {
            if (element.RedniBroj == id) {
                this.promatraniRent = element;
                $("#brojRenta").text("Rent #" + id);
                $("#lbl3Datum").val(element.Datum);
                $("#lbl3Vrijeme").val(element.Vrijeme);
                $("#lbl3Vrsta").val(element.VrstaOpreme);
                $("#lbl3SvaOprema").val(element.Rental);
                $("#lbl3Predstavnik").val(element.Predstavnik);
                $("#lbl3Zemlja").val(element.Zemlja);
                $("#lbl3Kolicina").val(element.Kolicina);
                $("#lbl3Trajanje").val(element.Trajanje);
                $("#lbl3Nacin").val(element.NacinPlacanja);
                $("#lbl3Email").val(element.Email);
                $("#lbl3Kontakt").val(element.Kontakt);
                $("#lbl3Ukupno").val(element.UkupanIznos);
                $("#lbl3Placeno").val(element.Placeno);
                $("#lbl3Platiti").val(element.ZaPlatiti);
                $("#lbl3Napomena").val(element.Napomena);
                $("#lbl3Vraceno").val(element.Vraceno);
                $("#lbl3Booker").val(element.Booker);
            }
        });

        this.idPromatranogRenta = id;

        let danas: Date = new Date();
        let dd: number = danas.getDate();
        let mm: number = danas.getMonth() + 1; //January is 0!        
        let yyyy: number = danas.getFullYear();
        let h = danas.getHours();
        let min = danas.getMinutes();

        let ddS, mmS, yyyyS: string;
        let minS;
        let hS;

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

        if (min < 10) {
            minS = '0' + min;
        }
        else {
            minS = min;
        }
        if (h < 10) {
            hS = '0' + h;
        }
        else {
            hS = h;
        }

        var convertTime = require('convert-time');
        let t = convertTime(hS + ':' + minS);
        //datetimeDifference radi sa engleskim formatom datuma
        let sad = mmS + "." + ddS + "." + yyyy + ".," + t;

        let tad, tadFormatirano;
        tad = this.promatraniRent["Datum"] + "," + this.promatraniRent["Vrijeme"];

        //Potrebno je datum obraditi tako da bude u formatu mm-dd-yyyy
        var splitted = tad.split(".");
        tadFormatirano = splitted[1] + "." + splitted[0] + "." + splitted[2] + ".," + convertTime(this.promatraniRent["Vrijeme"]);

        const date1 = new Date(sad);
        const date2 = new Date(tadFormatirano);
        let result = datetimeDifference(date1, date2);

        //Ako je oprema penjacka potrebno je provjeriti jeli mozda gost koristio opremu vise od 1 dan        
        if (this.promatraniRent["VrstaOpreme"] == "Penjacka") {
            //Ako je onda mnozimo broj dana i ukupan iznos opreme 
            let ukupnoDana: number = 0;
            let cijenaPenjackePoDanu: number = this.promatraniRent["UkupanIznos"];
            let ukupnaCijena;
            if (result.days > 0 && (result.hours > 0 || result.minutes > 0 || result.seconds > 0)) {
                ukupnoDana = result.days + 1;
                ukupnaCijena = ukupnoDana * cijenaPenjackePoDanu;
                $("#lbl3Ukupno").val(ukupnaCijena);
                this.osvjeziZaPlatiti();
            }
            else if (result.days <= 0) {
                ukupnaCijena = ukupnoDana * cijenaPenjackePoDanu;
                $("#lbl3Ukupno").val(ukupnaCijena);
                this.osvjeziZaPlatiti();
            }
        }
        let protekloVremena="Dana: "+result.days+"\nSati: "+result.hours+"\nMinuta: "+result.minutes;
        $("#lbl3Proteklo").val(protekloVremena);
    }

    osvjeziZaPlatiti() {
        let ukupno: number = $("#lbl3Ukupno").val();
        let placeno: number = $("#lbl3Placeno").val();
        $("#lbl3Platiti").val(ukupno - placeno);
    }

    potvrdiVracanjeRenta() {
        var r = confirm("Rental #" + this.promatraniRent["RedniBroj"]+ " je vracen te su svi troskovi placeni . \nZelite li ovo pohraniti u bazu podataka?");
        if (r == true) {
            this.databaseService.vratiRent(this.promatraniRent, $("#lbl3Ukupno").val());
            this.modalService.dismissAll('Cross click');
            //this.router.navigate(["/dashboard"]);
            setTimeout(() => {
                this.ngOnInit();
            }, 1000);
        }
    }
}
