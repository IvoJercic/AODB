import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as $ from 'jquery';
import { IRezervacija } from './rezervacija.interface';
import { AllDataThisYear } from './allDataThisYear';

@Injectable(
  {
    providedIn: "root",
  }
)

export class DatabaseService {

  //#region 10 nizova za 10 godina (Aplikacija bi trebala raditi od 2020 do 2030)
  dohvaceniPodaci2020: Observable<any[]>;
  obradeniPodaci2020: IRezervacija[];

  dohvaceniPodaci2021: Observable<any[]>;
  obradeniPodaci2021: any[];

  dohvaceniPodaci2022: Observable<any[]>;
  obradeniPodaci2022: any[];

  dohvaceniPodaci2023: Observable<any[]>;
  obradeniPodaci2023: any[];

  dohvaceniPodaci2024: Observable<any[]>;
  obradeniPodaci2024: any[];

  dohvaceniPodaci2025: Observable<any[]>;
  obradeniPodaci2025: any[];

  dohvaceniPodaci2026: Observable<any[]>;
  obradeniPodaci2026: any[];

  dohvaceniPodaci2027: Observable<any[]>;
  obradeniPodaci2027: any[];

  dohvaceniPodaci2028: Observable<any[]>;
  obradeniPodaci2028: any[];

  dohvaceniPodaci2029: Observable<any[]>;
  obradeniPodaci2029: any[];

  dohvaceniPodaci2030: Observable<any[]>;
  obradeniPodaci2030: any[];
  //#endregion

  public penjackaOprema = [
    { Naziv: "Konopi / Ropes (70 m)", Cijena: 100 },
    { Naziv: "Kompleti / Quickdraws (12 pax)", Cijena: 100 },
    { Naziv: "Sprava za osiguravanje / Belay device (Grigri)", Cijena: 60 },
    { Naziv: "Sprava za osiguravanje / Belay device (Atc)", Cijena: 40 },
    { Naziv: "Penjačke cipele / Climbing shoes", Cijena: 40 },
    { Naziv: "Penjacki pojas / Climbing harness", Cijena: 40, },
    { Naziv: "Peljačka kaciga / Climbing helmet", Cijena: 40, },
    { Naziv: "Vreća s kredom / Chalk bags", Cijena: 20 },
    { Naziv: "Penjački komplet A: Konopi (70 m) + Kompleti (12 pax) + Sprava za osiguravanje (Atc)", Cijena: 220 },
    { Naziv: "Penjački komplet B: Konopi (70 m) + Kompleti (12 pax) + Sprava za osiguravanje (Atc) + Penjačke cipele (2 pax) + Penjački pojas (2 pax) + Penjačke kacige (2 pax) + Vreća s kredom (1 pax)", Cijena: 400 }
  ]

  public ostalaOprema = [
    { Naziv: "Bike", Sat: 25, Dan: 145, TriDana: 350, Tjedan: 650, Neodredeno: 0 },
    { Naziv: "Kayak", Sat: 75, Dan: 250, TriDana: 600, Tjedan: 1200, Neodredeno: 0 },
    { Naziv: "SUP", Sat: 75, Dan: 250, TriDana: 600, Tjedan: 1200, Neodredeno: 0 },
  ]

  constructor(private db: AngularFirestore,
    private afa: AngularFireAuth,
    private router: Router) { }

  //referncaZaSpremanje:string="users/";//U Firestore ne mozemo ko putanju stavit email jer sadrzi tocku pa je mramo maknit
  ovaGod: number = new Date().getFullYear();//Trenutna godina
  trenutnoPrijavljen: string;
  brojNasihIzleta: number;
  brojGostiju: number;
  brojPartnerskihIzleta: number;
  brojRentaneOpreme: number;
  brojRentanihPatika: number;

  brojPrebacaja:number;

  brojPartnera: number;
  brojPlatformi: number;
  brojVodica: number;
  brojVozaca: number;
  brojVrstaIzleta: number;
  brojVrstaPartnerskihIzleta: number;
  referncaZaSpremanje: string;
  podaciOvaGodina: AllDataThisYear;
  //Svojstva objekta tipa AllDataThisYear
  templistaSvihNasihIzleta: any = null;
  templistaSvihPartnerskihIzleta: any = null;
  templistaSvihRentovaOpreme: any = null;
  templistaSvihRentovaPatika: any = null;

  templistaSvihPrebacaja: any = null;


  tempconstVodici: any = null;
  tempconstVozaci: any = null;
  tempconstPartneri: any = null;
  tempconstIzleti: any = null;
  tempconstPartnerskiIzleti: any = null;
  tempconstPlatforme: any = null;
  indeksNasihIzleta: number;
  indeksPartnerskihIzleta: number;
  indeksOpreme: number;
  indeksPatika: number;
  indeksTura: number;//Tura nije isto sta i izlet, jedna tura se sastoji od vise grupa tj u ovom koodu izleta (glupi nazivi jbgg)
  indeksPrebacaja: number;

  spremljeneTure;
  moguceSpremanje;
  placeRadnika;

  podaciZaDatoteku:Observable<any>;

  osvjeziOvogodisnjePodatke() {
    //console.log(localStorage.getItem("user"));
    if (localStorage.getItem("user") == "ivica.beovic@gmail.com") {
      this.trenutnoPrijavljen = "Ivo Beovic";
    }
    else if (localStorage.getItem("user") == "antonela.brzovic0203@gmail.com") {
      this.trenutnoPrijavljen = "Antonela Brzovic";
    }
    else if (localStorage.getItem("user") == "marinela.123br@gmail.com") {
      this.trenutnoPrijavljen = "Marinela Brzovic";
    }
    else {
      this.trenutnoPrijavljen = "Ivo Jercic";
    }

    let temp = this.db.collection(this.ovaGod + "/booking/ours/").valueChanges();
    temp.subscribe(
      data => {
        this.templistaSvihNasihIzleta = data;
        this.brojNasihIzleta = this.templistaSvihNasihIzleta.length;
      })


    temp = this.db.collection(this.ovaGod + "/booking/partners/").valueChanges();
    temp.subscribe(
      data => {
        this.templistaSvihPartnerskihIzleta = data;
        this.brojPartnerskihIzleta = this.templistaSvihPartnerskihIzleta.length;
      })

    temp = this.db.collection(this.ovaGod + "/rent/equipment/").valueChanges();
    temp.subscribe(
      data => {
        this.templistaSvihRentovaOpreme = data;
        this.brojRentaneOpreme = this.templistaSvihRentovaOpreme.length;
      })

    temp = this.db.collection(this.ovaGod + "/rent/shoes/").valueChanges();
    temp.subscribe(
      data => {
        this.templistaSvihRentovaPatika = data;
        this.brojRentanihPatika = this.templistaSvihRentovaPatika.length;
      })

    temp = this.db.collection(this.ovaGod + "/other/prebacaji/").valueChanges();
    temp.subscribe(
      data => {
        this.templistaSvihPrebacaja = data;
        this.brojPrebacaja = this.templistaSvihPrebacaja.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/guides/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstVodici = data;
        this.brojVodica = this.tempconstVodici.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/drivers/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstVozaci = data;
        this.brojVozaca = this.tempconstVozaci.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/partners/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstPartneri = data;
        this.brojPartnera = this.tempconstPartneri.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/trips/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstIzleti = data;
        this.brojVrstaIzleta = this.tempconstIzleti.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/partnersTrips/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstPartnerskiIzleti = data;
        this.brojVrstaPartnerskihIzleta = this.tempconstPartnerskiIzleti.length;
      })

    temp = this.db.collection(this.ovaGod + "/const/platforms/").valueChanges();
    temp.subscribe(
      data => {
        this.tempconstPlatforme = data;
        this.brojPlatformi = this.tempconstPlatforme.length;
        this.podaciOvaGodina = new AllDataThisYear(this.templistaSvihNasihIzleta, this.templistaSvihPartnerskihIzleta, this.templistaSvihRentovaOpreme, this.templistaSvihRentovaPatika,this.templistaSvihPrebacaja ,this.tempconstIzleti, this.tempconstVodici, this.tempconstVozaci, this.tempconstPlatforme, this.tempconstPartneri, this.tempconstPartnerskiIzleti);
        //this.podaciZaDatoteku=this.podaciOvaGodina;
      })


    temp = this.db.collection(this.ovaGod + "/const/indices/").valueChanges();
    temp.subscribe(
      data => {
        this.indeksNasihIzleta = Object(data[0]).Index;
        this.indeksPartnerskihIzleta = Object(data[1]).Index;
        this.indeksPrebacaja = Object(data[2]).Index;
        this.indeksOpreme = Object(data[3]).Index;
        this.indeksPatika = Object(data[4]).Index;
        this.indeksTura = Object(data[5]).Index;
      })

    temp = this.db.collection(this.ovaGod + "/other/tours/").valueChanges();
    temp.subscribe(
      data => {
        this.spremljeneTure = data;
      });

    temp = this.db.collection(this.ovaGod + "/other/salary/").valueChanges();
    temp.subscribe(
      data => {
        this.placeRadnika = data;
      });
  }

  prijaviKorisnika(email: string, password: string) {
    //this.db.firestore.enablePersistence();
    return this.afa.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.osvjeziOvogodisnjePodatke();
        // this.db.firestore.disableNetwork()
        //   .then(function () {
        //     // Do offline actions
        //     // ...
        //     alert("ONEMOGUCEN PRISTUP NETU !");
        //   });

        localStorage.setItem("user", email);
        this.router.navigate(['/dashboard']);
        if (email == "ivica.beovic@gmail.com") {
          this.trenutnoPrijavljen = "Ivo Beovic";
        }
        else if (email == "antonela.brzovic0203@gmail.com") {
          this.trenutnoPrijavljen = "Antonela Brzovic";
        }
        else if (email == "marinela.123br@gmail.com") {
          this.trenutnoPrijavljen = "Marinela Brzovic";
        }
        else {
          this.trenutnoPrijavljen = "Ivo Jercic";
        }
      }).catch((error) => {
        window.alert(error.message)
        $("#passwordLogin").val("");
        $("#usernameLogin").val("");
        $("#btnLogin").prop("disabled", false);
        return;
      })
  }

  izradiPotpisIzleta(izlet: Object): string {
    return Object(izlet["Datum"]) + " " + Object(izlet["Vrijeme"]) + " " + Object(izlet["Izlet"]);
  }

  odjaviKorisnika() {
    let pop = confirm("Da li ste sigurni da se zelite odjaviti sa racuna : " + this.trenutnoPrijavljen + " ?");
    if (pop == true) {
      return this.afa.auth.signOut().then(() => {
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
      })
    }
  }

  spremiAOIzletUBazu(rezervacija: Object, id: number) {
    this.moguceSpremanje = true;
    this.spremljeneTure.forEach(element => {
      if (this.izradiPotpisIzleta(rezervacija) == element.PotpisTure) {
        alert("Nije moguce spremiti izlet jer je navedeni termin zakljucan !");
        this.moguceSpremanje = false;
      }
    });

    if (this.moguceSpremanje == true) {
      this.referncaZaSpremanje = this.ovaGod + "/booking/ours";
      this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(rezervacija).then(doc => {
        this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
        this.db.collection(this.referncaZaSpremanje).doc("ourTripsIndex").set({ Index: this.indeksNasihIzleta + 1 }).then(doc => {
          this.osvjeziOvogodisnjePodatke();
        });
      });
    }
  }

  spremiTuruUBazu(tura: Object, id: number) {
    this.referncaZaSpremanje = this.ovaGod + "/other/tours";
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(tura).then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
      this.db.collection(this.referncaZaSpremanje).doc("tourIndex").update({ Index: this.indeksTura + 1 }).then(doc2 => {
        this.osvjeziOvogodisnjePodatke();
      });
    });
  }

  spremiRentUBazu(rent: Object, id: number) {
    this.referncaZaSpremanje = this.ovaGod + "/rent/equipment";
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(rent).then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
      this.db.collection(this.referncaZaSpremanje).doc("rentIndex").set({ Index: this.indeksOpreme + 1 }).then(doc => {
        this.osvjeziOvogodisnjePodatke();
      });
    });
  }

  spremiSuradnickiIzletUBazu(rezervacija: Object, id: number) {
    this.referncaZaSpremanje = this.ovaGod + "/booking/partners";
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(rezervacija).then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
      this.db.collection(this.referncaZaSpremanje).doc("partnersTripsIndex").set({ Index: this.indeksPartnerskihIzleta + 1 }).then(doc => {
        this.osvjeziOvogodisnjePodatke();
      });
    });

  }

  spremiPatikeUBazu(rezervacija: Object, id: number) {
    this.referncaZaSpremanje = this.ovaGod + "/rent/shoes";
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(rezervacija).then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
      this.db.collection(this.referncaZaSpremanje).doc("shoesIndex").set({ Index: this.indeksPatika + 1 }).then(doc => {
        this.osvjeziOvogodisnjePodatke();
      });
    });
  }

  spremiPrebacajUBazu(rezervacija: Object, id: number) {
    this.referncaZaSpremanje = this.ovaGod + "/other/prebacaji";
    this.db.collection(this.referncaZaSpremanje).doc(id.toString()).set(rezervacija).then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/const/indices/";
      this.db.collection(this.referncaZaSpremanje).doc("prebacajIndex").set({ Index: this.indeksPrebacaja + 1 }).then(doc => {
        this.osvjeziOvogodisnjePodatke();
      });
    });
  }

  spremiSuradnikaUBazu(rezervacija: Object, id: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/partners";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  spremiVodicaUBazu(rezervacija: Object, id: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/guides";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  spremiVozacaUBazu(rezervacija: Object, id: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/drivers";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  spremiPlatformuUBazu(rezervacija: Object, id: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/platforms";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  spremiIzletUBazu(rezervacija: Object, id: string) {
    //Spremanje vrste izleta, tj konstante a ne konkretne ture za odredenu osobu
    this.referncaZaSpremanje = this.ovaGod + "/const/trips";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  spremiIzletSuradnikaUBazu(rezervacija: Object, id: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/partnersTrips";
    this.db.collection(this.referncaZaSpremanje).doc((id).toString()).set(rezervacija).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  dohvatiTureNaDaniDatum(datumFormatirano: string) {
    //Dohvaca potpise ture iz podatakaZa ovu godinu za dani datum 
    let sviIzletiDanas: IRezervacija[] = [];
    this.podaciOvaGodina.listaSvihNasihIzleta.forEach(element => {
      if (element.Datum == datumFormatirano) {
        sviIzletiDanas.push(element);
      }
    });

    //Ture danas, ne izleti nego bas ture
    //Kljuc je potpis izleta a vrijednost je broj gostiju
    let rijecnik: { [potpisIzleta: string]: number; } = {};
    let potpisIzleta: string = "";
    for (let index = 0; index < sviIzletiDanas.length; index++) {
      potpisIzleta = "";
      potpisIzleta += sviIzletiDanas[index].Datum + " " + sviIzletiDanas[index].Vrijeme + " " + sviIzletiDanas[index].Izlet;
      if (rijecnik[potpisIzleta] == null) {
        rijecnik[potpisIzleta] = Number(sviIzletiDanas[index].Gostiju);
      }
      else {
        rijecnik[potpisIzleta] += Number(sviIzletiDanas[index].Gostiju);
      }
    }
    return rijecnik;
  }

  dohvatiNevraceniRent() {
    let lista = [];
    this.podaciOvaGodina.listaSvihRentovaOpreme.forEach(element => {
      if (element.Vraceno == false) {
        lista.push(element);
      }
    });
    return lista;
  }

  ukloniNasIzlet(suradnik: string) {
    //Zapravo je ovo referenca za brisanje ali zbog jednostavnosti smo ostaviili istu varijablju    
    this.referncaZaSpremanje = this.ovaGod + "/const/trips";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  ukloniPartnerskiIzlet(suradnik: string) {
    //Zapravo je ovo referenca za brisanje ali zbog jednostavnosti smo ostaviili istu varijablju    
    this.referncaZaSpremanje = this.ovaGod + "/const/partnersTrips";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  ukloniPlatformu(suradnik: string) {
    //Copy paste pa neka se parametar svugdi zove suradnik iako nije svugdi suradnik
    this.referncaZaSpremanje = this.ovaGod + "/const/platforms";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  ukloniSuradnika(suradnik: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/partners";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  ukloniVodica(suradnik: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/guides";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  ukloniVozaca(suradnik: string) {
    this.referncaZaSpremanje = this.ovaGod + "/const/drivers";
    this.db.collection(this.referncaZaSpremanje).doc(suradnik).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  azurirajIzlet(rezervacija: IRezervacija) {
    this.referncaZaSpremanje = this.ovaGod + "/booking/ours";
    this.db.collection(this.referncaZaSpremanje).doc((rezervacija.RedniBroj - 1).toString()).update({
      GostiDosli: true,
      ZaPlatiti: 0,
      Placeno: rezervacija.UkupanIznos
    }).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  arhivirajGrupu(grupa: IRezervacija) {
    this.referncaZaSpremanje = this.ovaGod + "/booking/ours";
    this.db.collection(this.referncaZaSpremanje).doc((grupa.RedniBroj - 1).toString()).delete().then(doc => {
      this.referncaZaSpremanje = this.ovaGod + "/other/canceledGroups";
      this.db.collection(this.referncaZaSpremanje).doc((grupa.RedniBroj - 1).toString()).set(grupa).then(doc => {
        this.osvjeziOvogodisnjePodatke();
        //console.log(this.podaciOvaGodina.listaSvihNasihIzleta);
      })
    })
  }

  izbrisiSuradnikovIzlet(izlet: Object) {
    this.referncaZaSpremanje = this.ovaGod + "/booking/partners";
    this.db.collection(this.referncaZaSpremanje).doc((parseInt(izlet["RedniBroj"]) - 1).toString()).delete().then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  vratiRent(rent: object, UkupanIznos: number) {
    this.referncaZaSpremanje = this.ovaGod + "/rent/equipment";
    this.db.collection(this.referncaZaSpremanje).doc((rent["RedniBroj"] - 1).toString()).update({
      Vraceno: true,
      UkupanIznos: UkupanIznos,
      ZaPlatiti: 0,
      Placeno: UkupanIznos
    }).then(doc => {
      this.osvjeziOvogodisnjePodatke();
    })
  }

  platiRadnika(tura: Object, radnik: String, gotovina: string, racun: string) {
    let starNizRadnika = [];

    this.spremljeneTure.forEach(element => {
      if (tura["RedniBroj"] == element.RedniBroj) {
        starNizRadnika = element.NizNeplacenihRadnika;
      }
    });

    let br = 0;
    starNizRadnika.forEach(element => {
      if (element == radnik) {
        br++;
      }
    });

    for (let i = 0; i < br; i++) {
      var index = starNizRadnika.indexOf(radnik);
      if (index !== -1) {
        starNizRadnika.splice(index, 1);
      }
    }

    let stariRacun: number = 0;
    let staraGotovina: number = 0;
    if (this.placeRadnika.length > 0) {
      this.placeRadnika.forEach(element => {
        if (element.Ime == radnik) {
          staraGotovina = Number(element.Gotovina);
          stariRacun = Number(element.Racun);
        }
      });
    }

    stariRacun += parseInt(racun);
    staraGotovina += parseInt(gotovina);

    let ob: Object = {
      Ime: radnik,
      Gotovina: staraGotovina,
      Racun: stariRacun
    };

    this.referncaZaSpremanje = this.ovaGod + "/other/tours";
    this.db.collection(this.referncaZaSpremanje).doc((parseInt(tura["RedniBroj"]) - 1).toString()).update({ NizNeplacenihRadnika: starNizRadnika }).then(doc2 => {
      this.referncaZaSpremanje = this.ovaGod + "/other/salary";
      this.db.collection(this.referncaZaSpremanje).doc((radnik).toString()).set(ob).then(doc3 => {
        this.osvjeziOvogodisnjePodatke();
      })
    });
  }
}