//Napravit cemo klasu koja ce nazive svojstvava dobiti po putanjama u bazi podataka(prevedeno u odnosu na bazu)
export class AllDataThisYear{
    listaSvihNasihIzleta:any;
    listaSvihPartnerskihIzleta:any;
    listaSvihRentovaOpreme:any;
    listaSvihRentovaPatika:any;
    listaSvihPrebacaja:any;

    constVodici:any;
    constVozaci:any;
    constPartneri:any;
    constIzleti:any;
    constPartnerskiIzleti:any;
    constPlatforme;
    
    constructor(listaSvihNasihIzleta,listaSvihPartnerskihIzleta,listaSvihRentovaOpreme,listaSvihRentovaPatika,listaSvihPrebacaja,constIzleti,constVodici,constVozaci,constPlatforme,constPartneri,constPartnerskiIzleti)
    {
        this.listaSvihNasihIzleta=listaSvihNasihIzleta;
        this.listaSvihPartnerskihIzleta=listaSvihPartnerskihIzleta;
        this.listaSvihRentovaOpreme=listaSvihRentovaOpreme;
        this.listaSvihRentovaPatika=listaSvihRentovaPatika;
        this.listaSvihPrebacaja=listaSvihPrebacaja;
        this.constIzleti=constIzleti;
        this.constVodici=constVodici;
        this.constVozaci=constVozaci;
        this.constPlatforme=constPlatforme;
        this.constPartneri=constPartneri;
        this.constPartnerskiIzleti=constPartnerskiIzleti;
    }
}