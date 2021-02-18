import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';
import * as jsPDF from 'jspdf'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: "pm-allRents",
    templateUrl: './allRents.component.html',
    styleUrls: ['../allGroups/allGroups.component.css']
})

export class AllRentsComponent implements OnInit {
    constructor(private modalService: NgbModal,
        public databaseService: DatabaseService) { }

    promatraniRent;
    
    ngOnInit() {
        this.databaseService.podaciOvaGodina.listaSvihRentovaOpreme.sort((a, b) => (a.RedniBroj > b.RedniBroj) ? -1 : 1);
    }

    otvoriModalBox(content): void {
        this.modalService.open(content);
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
    }
}

