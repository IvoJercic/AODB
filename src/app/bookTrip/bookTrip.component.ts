import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import * as jsPDF from 'jspdf'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
    selector: "pm-bookTrip",
    templateUrl: './bookTrip.component.html',
    styleUrls: ['./bookTrip.component.css']
})

export class BookTripComponent implements OnInit {
    postotakProvizijeSuradniku: number;

    datum: string;
    vrijeme: string;
    predstavnik: string;
    vrstaIzleta: string;
    brojLjudi: number;
    opcijaSuradnika: string;
    iznosSuradnik: number;//Pamti koliko novaca suradnik mora na kraju mjeseca prosljediti nama i obratno
    nacinPlacanja: string;
    privatnaTura: string;
    popust: number;
    napomena: string;
    suradnik: string;
    zemlja: string;
    mjestoSusreta: string;
    kontakt: string;
    email: string;
    ukupno: number;
    placeno: number;
    zaPlatiti: number;
    platforma: number;
    booker: string;
    prijevoz: number = $("#prijevozUnos").val();
    tureOdabraniDan:object[]=[];

    constructor(public modalService: NgbModal,
        private router: Router,
        public databaseService: DatabaseService) { }

    //Varijable vidljive svima, deklarirane su ovdje kako bi bile dostupne kod koristenja ngFora
    listaKardinalnihGresaka: Array<string> = [];
    listaObicnihGresaka: Array<string> = [];

    ngOnInit() {
        this.postotakProvizijeSuradniku = 0.2;
        this.booker = this.databaseService.trenutnoPrijavljen;
        $("#popisTuraTajDan").hide();
        $("#platiSve").prop("checked", true);

    }

    osvjeziCijenu() {
        let brojOsoba: number = $("#osobaUnos").val();
        let cijenaPoIzletu: number = $("#vrstaUnos").val();
        let popust: number = $("#popustUnos").val() / 100;
        let cijenaPrijevoza: number = parseInt($("#prijevozUnos").val());
        let suradnik: string = $('#suradnikUnos').val();
        let provizijaSuradniku: number = 0.20;

        //Ukupan iznos na koji se obracunaju popusti, VIP ture itd.
        let ukupanIznos = (((cijenaPoIzletu - (cijenaPoIzletu * popust)) * brojOsoba));

        if ($('#radioDaPrivatna').is(':checked')) {
            ukupanIznos = ukupanIznos * 2;
        }

        //Ako su gosti platili 20% akontacije suradniku ukupna cijena ce biti 80% ukupne cijene
        if (suradnik != "Nema" && $('#plati80').is(':checked')) {
            ukupanIznos = ukupanIznos - (ukupanIznos * provizijaSuradniku);
        }

        //Ako su gosti platili sve suradniku ukupna cijena je ista ali je sve placeno
        if (suradnik != "Nema" && $('#platiNista').is(':checked')) {
            ukupanIznos = 0;
        }

        //Cijena prijevoza je izdvojena jer ona ne ulazi u duplanja prilikom VIP tura i prilikom obracuna za placanje suradnicima
        ukupanIznos += cijenaPrijevoza;
        $("#ukupnoUnos").val(ukupanIznos);

        let placeniIznos: number = $("#placenoUnos").val();
        $("#zaPlatitiUnos").val(ukupanIznos - placeniIznos);
    }

    centirajTekst(txt: string, x1: number, x2: number): number {
        let centar: number = (x1 + x2) / 2;
        return centar - txt.length;
    }

    generirajPDFIzleti() {
        if (this.mjestoSusreta != "Agencija") {
            this.napomena += "\nMeeting point: " + this.mjestoSusreta;
        }

        if (this.popust > 0) {
            this.napomena += "\nDiscount: " + this.popust + "%";
        }

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

        let datumFormatirano: string = ddS + "." + mmS + "." + yyyy + ".";

        var doc = new jsPDF();
        var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gNzUK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgA4QEsAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiii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j4g8m1HTJ9L+HemrcoUkuL5p9jdQCoA/QZ/Gr/iO5n8K6/ezW6kJq1jhSOzkYJ+o6/jXqd5p9nqEax3ltFOincqyKGAPrTLvStPv/K+12cE/lf6vzEDbfp+QoA8q1LS/7IsfB1uy4kabzZP95mU/4CttP+S1f9sD/wCi67y502yvHhe5tYZWhOYy6A7D7enSj+zbL7f9u+yw/a8Y87YN+MY6/SgDgdQb4a3V7LLcSqsxY79iTKN2eeAMVz9mNNi+IWn/APCKPM9uWXfndjH8XXnGPWvU28M6EzFm0mzLE5JMI5qxZ6Rp2nuXs7G3gYjBaOMKcfWgDz/x/eWvjPwVqceiu9xNpdypmQRkEEEg4z14yePSm+DPif4btvCthZanfG0urWFYWVoXYHaMAgqD2Ar0Sz0uw08zGzs4YDO2+UxoF3n1Pr1qlP4T8PXMrSzaJp7yMcljbrkn8qAPKvH+oQXusaJ410hmvdMt5BFJIiMu1kbdgggEZB610/iP4peGZPC14LC++0Xc8DRxwCJgQWGOcjAxmu6tdJ0+ysjZW1lbxWrEkwrGAhJ68dKpxeFPD0NwJ49E09ZQchhbrwfyoGeHXmjXOk/BmGS6jaN7zUVnVG4O3bgH8cZrV8S3s/gnxJHq9qpEeraQIzjs+xRn8CFNe032mWOp24t760huYVIYJKgYA+uDUd9oelanFDFfafbXMcIxGssYYIOnGenQUBc8L1fRTonhLwdG67Zri6NzJnrltuP0Ar6BT7i/QVUvNI07UfJ+2WUE/knMXmRhth9vSrvQYoEJRS0UAFFFFABRRRQAlLRRQAUlLRQAUUUUAFFFFABRRRQAUUUUAVtQtzd6dcW6/ekjZR9cVweg+Dbm4uBPqCmGCNv9WfvPj+Qr0WisKuGhVkpS6HXQxlShTlCHUwtd8MWusRBkxDcqMLIBwR6EVzGieENTj1aGe5RIooJAxJbJbHpXolFTPCUpzU2tS6WYV6dN0k9H+AUUUV0nCFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB/9k=';
        doc.setFillColor(210, 210, 210);
        doc.rect(10, 85, 190, 5, 'F');
        doc.rect(10, 105, 190, 5, 'F');
        doc.rect(10, 125, 190, 5, 'F');
        doc.setTextColor(0, 0, 0);
        doc.addImage(imgData, 'JPEG', 70, 0, 70, 50);
        doc.setFontSize(12);
        doc.text(25, 54, "Rock climbing j.d.o.o, OIB: 61936698462, IBAN: HR 8923400091110653768,");
        doc.text(40, 59, "HR-AB-21-060312604, Poljicka cesta 61, 21253 Gata, Croatia");
        doc.setFontSize(18);
        doc.setFontType('bold');
        doc.text(10, 75, "Voucher 00#"+Number(Number(this.databaseService.indeksNasihIzleta)+1));
        doc.setFontType('normal');
        doc.text(148, 75, "Omiš, " + datumFormatirano);
        doc.line(10, 85, 200, 85);
        doc.line(10, 90, 200, 90);
        doc.setFontSize(12);
        doc.setFontType('bold');
        doc.text(35, 89, "Guest name");
        doc.text(105, 89, "Activity");
        doc.text(158, 89, "Date and time");
        doc.line(85, 85, 85, 105);
        doc.line(140, 85, 140, 105);
        doc.line(10, 105, 200, 105);
        doc.line(10, 110, 200, 110);
        doc.text(19, 109, "No. of people");
        doc.text(69, 109, "Total price");
        doc.text(123, 109, "Paid");
        doc.text(168, 109, "To pay");
        doc.line(55, 105, 55, 125);
        doc.line(105, 105, 105, 125);
        doc.line(150, 105, 150, 125);
        doc.line(10, 125, 200, 125);
        doc.line(10, 130, 200, 130);
        doc.line(10, 145, 200, 145);
        doc.text(40, 129, "Booking agent");
        doc.text(135, 129, "Additional comment");
        doc.line(105, 125, 105, 145);
        doc.setFontType('normal');
        doc.setFontSize(12);
        doc.text(10, 155, "*Vouchers are refundable 24 hours before the set date.");
        doc.text(10, 162, "*Duplication, duplicate use, sale or trade of a voucher is prohibited.");
        doc.text(10, 169, "*Your voucher must be handed to your guide on the day of your activity.");
        doc.text(10, 176, "*Full payment should be made upon arrival to your guide or other personnel.");
        doc.text(10, 183, "*To change the date, number of people etc. of your voucher please contact us for futher assistence.");
        doc.text(10, 190, "*Trips are not refundable if for any reason guest decides to quit the trip.");
        doc.text(10, 255, "Contact info:");
        doc.setFontType('bold');
        doc.text(10, 264, "Mob: +385 98 447 135");
        doc.text(10, 271, "Email: adventureomis@gmail.com");
        doc.text(10, 278, "Web: www.adventure-omis.com");
        doc.setFontType('normal');
        doc.text(118, 278, "Agent signature :_____________________ ");

        //Ubacit varijable
        doc.setFontSize(8);
        doc.text(107, 134, this.napomena);
        doc.setFontSize(12);
        doc.text(this.centirajTekst(this.predstavnik, 10, 85), 99, this.predstavnik);
        doc.text(this.centirajTekst(this.vrstaIzleta, 85, 140), 99, this.vrstaIzleta);
        doc.text(this.centirajTekst(String(this.datum + " " + this.vrijeme), 140, 200), 99, String(this.datum + " " + this.vrijeme));
        doc.text(this.centirajTekst(String(this.brojLjudi), 10, 55), 119, String(this.brojLjudi));
        doc.text(this.centirajTekst(String(this.ukupno) + " HRK", 55, 105), 119, String(this.ukupno) + " HRK");
        doc.text(this.centirajTekst(String(this.placeno) + " HRK", 105, 150), 119, String(this.placeno) + " HRK");
        doc.text(this.centirajTekst(String(this.zaPlatiti) + " HRK", 150, 200), 119, String(this.zaPlatiti) + " HRK");
        doc.text(this.centirajTekst(this.booker, 10, 105), 138, this.booker);
        doc.text(this.centirajTekst(String("(" + this.booker + ")"), 150, 199), 285, String("(" + this.booker + ")"));
        doc.save("Booking #"+Number(Number(this.databaseService.indeksNasihIzleta)+1));
    }

    promijeniPlatformu() {
        if ($('#platformaUnos').val() == "Nema") {
            $("#suradnikUnos").prop("disabled", false);
        }
        else {
            $("#suradnikUnos").prop("disabled", true);
            $("#suradnikUnos").prop('selectedIndex', 0);
        }
    }

    promijeniSuradnika() {
        if ($('#suradnikUnos').val() == "Nema") {
            $('#suradnikOpcijaUnos').hide(500);
            $("#platformaUnos").prop("disabled", false);

        }
        else {
            $('#suradnikOpcijaUnos').show(500);
            $("#platformaUnos").prop("disabled", true);
            $("#platformaUnos").prop('selectedIndex', 0);
        }
        this.osvjeziCijenu();
    }

    promijeniOpcijeSuradnika() {
        if (this.suradnik != "Nema" && $('#platiSve').is(':checked')) {
            $("#gotovina").prop("disabled", false);
            $("#kartica").prop("disabled", false);
        }
        else if (this.suradnik != "Nema" && $('#plati80').is(':checked')) {
            $("#gotovina").prop("disabled", false);
            $("#kartica").prop("disabled", false);
        }
        else if (this.suradnik != "Nema" && $('#platiNista').is(':checked')) {
            //Diseablamo polja za unos nacina placanja jer gosti ionako nista ne placaju
            $("#gotovina").prop("disabled", true);
            $("#kartica").prop("disabled", true);
        }

        this.osvjeziCijenu();
    }

    formatirajDatum(dateStr: string) {
        let dArr: string[] = dateStr.split("-");  // ex input "2010-01-18"
        return dArr[2] + "." + dArr[1] + "." + dArr[0] + "."; //ex out: "18/01/10"
    }

    potvrdiUnos(content) {
        this.listaKardinalnihGresaka = [];
        this.listaObicnihGresaka = [];

        this.datum = this.formatirajDatum($("#datumUnos").val());
        this.vrijeme = $("#vrijemeUnos").val();
        this.predstavnik = $("#predstavnikUnos").val();
        this.vrstaIzleta =$("#vrstaUnos").children("option").filter(":selected").text()
        this.brojLjudi = $("#osobaUnos").val();
        this.popust = $("#popustUnos").val();
        this.napomena = $("#napomenaUnos").val();
        this.suradnik = $("#suradnikUnos").val();
        this.zemlja = $("#zemljaUnos").val();
        this.mjestoSusreta = $("#mjestoUnos").val();
        this.kontakt = $("#kontaktUnos").val();
        this.email = $("#emailUnos").val();
        this.ukupno = $("#ukupnoUnos").val();
        this.placeno = $("#placenoUnos").val();
        this.zaPlatiti = $("#zaPlatitiUnos").val();
        this.platforma = $("#platformaUnos").val();
        this.prijevoz = $("#prijevozUnos").val();


        //Pridruzivanje vrijednosti varijabli vrstaPlacanja        
        if ($('#gotovina').is(':checked')) {
            this.nacinPlacanja = "Gotovina";
        }
        else {
            this.nacinPlacanja = "Kartica";
        }

        //Pridruzivanje vrijednosti varijabli privatnaTura        
        if ($('#radioNePrivatna').is(':checked')) {
            this.privatnaTura = "Ne";
        }
        else {
            this.privatnaTura = "Da";
        }

        let cijenaPoIzletu: number = $("#vrstaUnos").val();
        //Ukupan iznos na koji se obracunaju popusti, VIP ture itd.
        let ukupanIznos = (((cijenaPoIzletu - (cijenaPoIzletu * this.popust)) * this.brojLjudi));

        //Pridruzivanje vrijednosti varijabli opcijeSuradnika i iznosSuradnik
        if ($("#suradnikUnos").val() != "Nema" && $('#platiSve').is(':checked') == true) {
            this.opcijaSuradnika = "platiSve";
            //Ako gost placa sve, 20 % cemo morati dat suradniku, dakle predznak ce bit - jer mi moramo sa svog salda skinuti odredenu cifru
            this.iznosSuradnik = -(ukupanIznos * this.postotakProvizijeSuradniku);

        }
        else if ($("#suradnikUnos").val() != "Nema" && $('#plati80').is(':checked') == true) {
            //Ukoliko gost placa 80 % izleta, znaci da je 20% vec platio suradniku te tada niko nikome nije duzan
            this.opcijaSuradnika = "plati80";
            this.iznosSuradnik = 0;
        }
        else if ($("#suradnikUnos").val() != "Nema" && $('#platiNista').is(':checked') == true) {
            this.opcijaSuradnika = "platiNista";
            //Ukoliko gost ne placa nista u agenciji znaci da je sve platio kod suradnika, tada je suradnik potreban isplatiti nama 80% iznosa
            this.iznosSuradnik = (ukupanIznos * (1 - this.postotakProvizijeSuradniku));            
            
        }        
        else if($("#suradnikUnos").val() == "Nema" ) {
            this.opcijaSuradnika = "Nema";
            this.iznosSuradnik = 0;
        }

        //Veliki ifovi        
        let sumaProvjera = 0;
        if (this.datum.indexOf("undefined") && this.datum != null) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Datum");
        }

        if (this.vrijeme != null && this.vrijeme.length > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Vrijeme")
        }

        if (this.predstavnik.length > 1) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Predstavnik");
        }
       
        if (this.vrstaIzleta.length > 1 && this.vrstaIzleta!="Odaberi izlet") {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Vrsta izleta");
        }

        if (this.brojLjudi > 0) {
            sumaProvjera++;
        }
        else {
            this.listaKardinalnihGresaka.push("Broj gostiju");
        }

        //Prisiljavamo da ako korisnik unese suradnika da odabere i opciju suradnika
        if (($("#suradnikUnos").val() == "Nema" && this.opcijaSuradnika=="Nema") || (($("#suradnikUnos").val() != "Nema") && this.opcijaSuradnika!="Nema")) {
            sumaProvjera++;
        }
        else{
            this.listaKardinalnihGresaka.push("Opcija suradnika");
        }

        //Ispis o krivom ispisu
        if (sumaProvjera != 6) {
            this.otvoriModalBox(content);
            $("#modal-basic-title").html("Niste ispunili obavezna polja !");
            $("#btnPotvrdiUnos").hide();
            $("#tablicaObicnihGresaka").hide();
            $("#tablicaKardinalnihGresaka").show();
        }
        else {
            //console.log("SVE OBAVEZNO ISPUNJENO");
            //PROVJERI TOCNOST NEOBAVEZNIH STAVKI
            if (this.zemlja == null) {
                this.listaObicnihGresaka.push("Zemlja");
            }
            if (this.mjestoSusreta.length == 0) {
                this.listaObicnihGresaka.push("Mjesto susreta");
            }
            if (this.kontakt.length == 0) {
                this.listaObicnihGresaka.push("Kontakt");
            }
            if (this.email.length == 0) {
                this.listaObicnihGresaka.push("Email");
            }

            this.otvoriModalBox(content);

            //Nudimo korisniku mogucnost spremanja ture ili nadopunu neobaveznih podataka         
            $("#modal-basic-title").html("Zelite li spremiti turu ?");
            $("#btnPotvrdiUnos").show();
        }
    }

    zavrsniSUnosom() {
        this.modalService.dismissAll();
        
        //Izrada objekta za spremanje u bazu podataka
        var rezervacija: object = {
            Booker:this.booker,
            RedniBroj: this.databaseService.indeksNasihIzleta+1,
            Datum: this.datum,
            Vrijeme: this.vrijeme,
            Predstavnik: this.predstavnik,
            Platforma: this.platforma,
            Suradnik: this.suradnik,
            OpcijaSuradnika: this.opcijaSuradnika,
            IznosSuradnik: this.iznosSuradnik,
            Izlet: this.vrstaIzleta,
            Gostiju: this.brojLjudi,
            NacinPlacanja: this.nacinPlacanja,
            PrivatnaTura: this.privatnaTura,
            Popust: this.popust,
            TroskoviPrijevoza: this.prijevoz,
            MjestoSusreta: this.mjestoSusreta,
            Zemlja: this.zemlja,
            Kontakt: this.kontakt,
            Email: this.email,
            Napomena: this.napomena,
            UkupanIznos: this.ukupno,
            Placeno: this.placeno,
            ZaPlatiti: this.zaPlatiti,
            GostiDosli: false
        }

        this.databaseService.spremiAOIzletUBazu(rezervacija, this.databaseService.indeksNasihIzleta);
        if(this.databaseService.moguceSpremanje==true)
        {
            this.generirajPDFIzleti();
        }  
        this.router.navigate(["/dashboard"]);
              
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
    }

    popisTuraTogDana() {
        this.tureOdabraniDan=[];
        this.datum = this.formatirajDatum($("#datumUnos").val());
        let vraceniRijecnik = this.databaseService.dohvatiTureNaDaniDatum(this.datum);        
        for (let key in vraceniRijecnik) {
            let status="SLOBODNO";
            this.databaseService.spremljeneTure.forEach(element => {
                if(element.PotpisTure==key)
                {
                    status="ZAKLJUCANO";                    
                }
            });
            let splitted = key.split(" ", 4);     
            this.tureOdabraniDan.push({Vrijeme:splitted[1],Izlet:splitted[2]+" "+splitted[3],Gosti:vraceniRijecnik[key],Status:status});
        }
        $("#popisTuraTajDan").show();
    }
}