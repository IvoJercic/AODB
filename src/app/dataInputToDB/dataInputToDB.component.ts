import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: "pm-dataInputToDB",
    templateUrl: './dataInputToDB.component.html',
    styleUrls: ['./dataInputToDB.component.css']
})

export class DataInputToDBComponent implements OnInit {
    constructor(public modalService: NgbModal, public databaseService: DatabaseService) { }

    tipoviSuradnika = ["Agencija", "Apartman", "Hostel", "Hotel", "Kamp", "Ostalo"];
    listaKardinalnihGresaka = [];

    nazivIzleta;
    cijenaDjeca;
    cijenaOdrasli;
    nazivPlatforme;
    nazivSuradnika;
    tipSuradnika;
    imeVodica;
    imeVozaca;

    predmetUredivanja;

    ngOnInit() {
        $("#tblSuradnici").hide();
        $("#tblVodici").hide();
        $("#tblVozaci").hide();
        $("#tblPlatforme").hide();
        $("#tblIzleti").hide();
        $("#tblIzletiSuradnika").hide();

    }

    toggle(prviId: string, drugiId: string) {
        prviId = "#" + prviId;
        drugiId = "#" + drugiId;

            //Prvi id cemo sakrit a drugi pokazat
        $(prviId).toggle(250);
        $(drugiId).toggle(250);
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    potvrdaUnosSuradnika(content) {
        this.predmetUredivanja = "Suradnik";
        this.listaKardinalnihGresaka = [];

        this.nazivSuradnika = $("#nazivSuradnikaUnos").val();
        this.tipSuradnika = $("#tipSuradnikaUnos").val();

        let sumaProvjera = 0;
        if (this.nazivSuradnika.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Naziv suradnika");
        }

        if (this.tipSuradnika != null) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Tip suradnika");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 2) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            //console.log("SVE OBAVEZNO ISPUNJENO");
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li spremiti promjene ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    potvrdaUnosVodica(content) {
        this.predmetUredivanja = "Vodic";
        this.listaKardinalnihGresaka = [];
        this.imeVodica = $("#nazivVodicaUnos").val();

        let sumaProvjera = 0;
        if (this.imeVodica.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Ime vodica");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 1) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li pohraniti vodica ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    potvrdaUnosVozaca(content) {
        this.predmetUredivanja = "Vozac";
        this.listaKardinalnihGresaka = [];
        this.imeVozaca = $("#nazivVozacaUnos").val();

        let sumaProvjera = 0;
        if (this.imeVozaca.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Ime vozaca");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 1) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li pohraniti vozaca ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    potvrdaUnosPlatforme(content) {
        this.predmetUredivanja = "Platforma";
        this.listaKardinalnihGresaka = [];
        this.nazivPlatforme = $("#nazivPlatforme").val();

        let sumaProvjera = 0;
        if (this.nazivPlatforme.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Naziv platforme");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 1) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li pohraniti platformu ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    potvrdaUnosIzleta(content) {
        this.predmetUredivanja = "Izlet";
        this.listaKardinalnihGresaka = [];
        this.nazivIzleta = $("#nazivIzleta").val();
        this.cijenaDjeca = $("#cijenaDjecaUnos").val();
        this.cijenaOdrasli = $("#cijenaOdrasliUnos").val();

        let sumaProvjera = 0;
        if (this.nazivIzleta.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Naziv izleta");
        }

        if (this.cijenaOdrasli > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Cijena za odrasle");
        }

        if (this.cijenaDjeca > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Cijena za djecu");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 3) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li pohraniti izlet ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    potvrdaUnosIzletaSuradnika(content) {
        this.predmetUredivanja = "Izlet suradnika";
        this.listaKardinalnihGresaka = [];
        this.nazivIzleta = $("#nazivIzletaSuradnika").val();
        this.cijenaDjeca = $("#cijenaDjecaUnosSuradnici").val();
        this.cijenaOdrasli = $("#cijenaOdrasliUnosSuradnici").val();

        let sumaProvjera = 0;
        if (this.nazivIzleta.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Naziv izleta");
        }

        if (this.cijenaOdrasli > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Cijena za odrasle");
        }

        if (this.cijenaDjeca > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Cijena za djecu");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 3) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li pohraniti izlet suradnika ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    zavrsniSUnosom() {
        this.modalService.dismissAll();

        if (this.predmetUredivanja == "Suradnik") {
            var rezervacija: object = {
                Naziv: this.nazivSuradnika,
                Tip: this.tipSuradnika
            }
            this.databaseService.spremiSuradnikaUBazu(rezervacija, this.nazivSuradnika);
        }
        else if (this.predmetUredivanja == "Vodic") {
            var rezervacija: object = {
                Ime: this.imeVodica,
            }
            this.databaseService.spremiVodicaUBazu(rezervacija, this.imeVodica);
        }
        else if (this.predmetUredivanja == "Vozac") {
            var rezervacija: object = {
                Ime: this.imeVozaca,
            }
            this.databaseService.spremiVozacaUBazu(rezervacija, this.imeVozaca);
        }
        else if (this.predmetUredivanja == "Platforma") {
            var rezervacija: object = {
                Naziv: this.nazivPlatforme,
            }
            this.databaseService.spremiPlatformuUBazu(rezervacija, this.nazivPlatforme);
        }
        else if (this.predmetUredivanja == "Izlet") {
            var rezervacija: object = {
                Naziv: this.nazivIzleta,
                CijenaDjeca: this.cijenaDjeca,
                CijenaOdrasli: this.cijenaOdrasli
            }
            this.databaseService.spremiIzletUBazu(rezervacija, this.nazivIzleta);
        }
        else if (this.predmetUredivanja == "Izlet suradnika") {
            var rezervacija: object = {
                Naziv: this.nazivIzleta,
                CijenaDjeca: this.cijenaDjeca,
                CijenaOdrasli: this.cijenaOdrasli
            }
            this.databaseService.spremiIzletSuradnikaUBazu(rezervacija, this.nazivIzleta);
        }

        $('#formaUnosaKonstanti').trigger("reset");

    }

    ukloniNasIzlet(izlet: string) {
        var r = confirm("Ovime cete izlet '"+ izlet +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniNasIzlet(izlet);            
        } 
    }

    ukloniPartnerskiIzlet(izlet: string) {
        var r = confirm("Ovime cete partnerski izlet '"+ izlet +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniPartnerskiIzlet(izlet);            
        } 
    } 
    
    ukloniPlatformu(platforma: string) {
        var r = confirm("Ovime cete platformu '"+ platforma +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniPlatformu(platforma);            
        } 
    } 

    ukloniSuradnika(suradnik: string) {
        var r = confirm("Ovime cete suradnika '"+ suradnik +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniSuradnika(suradnik);            
        } 
    } 

    ukloniVodica(vodic: string) {
        var r = confirm("Ovime cete vodica '"+ vodic +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniVodica(vodic);            
        } 
    } 

    ukloniVozaca(vozac: string) {
        var r = confirm("Ovime cete vodica '"+ vozac +"' izbrisati iz baze podataka !");
        if (r == true) {
            this.databaseService.ukloniVozaca(vozac);            
        } 
    } 
}
