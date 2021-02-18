import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable,throwError, from} from  'rxjs';
import {catchError,tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable(
    {
      providedIn:"root",
    }
)
export class CurrencyConverterService{
    private mojLink="https://api.exchangeratesapi.io/latest?base=HRK";
    

    constructor(private http:HttpClient){}

    getValues():Observable<any []> {
        return this.http.get<any[]>(this.mojLink).pipe(
            //tap(data=>console.log("Svi podaci: "+JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    private handleError(err:HttpErrorResponse){
        let errorMessage="";
        if(err.error instanceof ErrorEvent){
            errorMessage="Dogodila se greska "+err.error.message;
        }
        else{
            errorMessage="Server je vratio kod: "+err.status+". Greska je "+err.message;
        }
        //console.error(errorMessage);
        return throwError(errorMessage);
    }
}

 
