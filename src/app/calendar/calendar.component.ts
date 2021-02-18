import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { DatabaseService } from '../shared/database.service';
import { IRezervacija } from '../shared/rezervacija.interface';

const colors: any = {
  red: {
    primary: '#ad2121',
  },
  blue: {
    primary: '#1b26f5',
  },
  yellow: {
    primary: '#e3bc08',
  },
  green: {
    primary: "#008000",
  },
  orange: {
    primary: "#f5c61b",
  },
  cyan: {
    primary: "#1effec",
  },
  purple: {
    primary: "#e324e3",
  },
  pink: {
    primary: "#ff1e9a",
  },
  grey: {
    primary: "#6f7a79",
  },
  black: {
    primary: "#000000",
  },
  gold: {
    primary: "#7f8a0c",
  }
};

@Component({
  selector: 'pm-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: { action: string; event: CalendarEvent; };
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];
  izleti = [];
  constructor(public databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.tempconstIzleti.forEach(element => {
      this.izleti.push(element.Naziv);
    });
    this.activeDayIsOpen = false;

    let el: IRezervacija;
    this.databaseService.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
      el = element;
      let splited = el.Datum.split(".", 3);
      let d = splited[0];
      let m = splited[1];
      let y = splited[2];
      let datumFormatirano = m + "/" + d + "/" + y;
      let dogadaj: any;
      if (element.GostiDosli == true) {
        dogadaj = {
          start: startOfDay(new Date(Date.parse(datumFormatirano))),
          title: "#" + el.RedniBroj + " | " + el.Vrijeme + " h --> " + el.Izlet + " - " + el.Gostiju + " pax",
          color: colors.green,
        };
      }
      else{
        dogadaj = {
          start: startOfDay(new Date(Date.parse(datumFormatirano))),
          title: "#" + el.RedniBroj + " | " + el.Vrijeme + " h --> " + el.Izlet + " - " + el.Gostiju + " pax",
          color: colors.red,
        };
      }

      this.events.push(dogadaj)
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
