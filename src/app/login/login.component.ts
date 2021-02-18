import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as $ from 'jquery';

@Component({
    selector:"pm-login",
    templateUrl: './login.component.html'
    //styleUrls: ['../styles.scss']
})

export class LoginComponent implements OnInit
{
    constructor(private dbService: DatabaseService) {}  

    ngOnInit():void
    {
        //2.5 sekundi pustimo da se aplikacija ucita
        $("#btnLogin").attr('disabled','disabled');
        $("#btnLogin").text("Ucitavanje");
        setTimeout(function(){ 
            $("#btnLogin").text("Prijavi se");
            $("#btnLogin").prop("disabled",false);

            // $("#usernameLogin").val("ijercic@pmfst.hr");
            // $("#passwordLogin").val('100posto'); 
        }, 2500);
    }

    prijava():void
    {        
        let email=$("#usernameLogin").val();
        let password=$("#passwordLogin").val(); 
        if(password.length<8)
        {
            alert("Vaša lozinka ima minimalno 8 znakova !");       
            $("#passwordLogin").val("");     
        }
        else
        {      
            $("#btnLogin").prop("disabled",true);
            this.dbService.trenutnoPrijavljen=email;
            this.dbService.prijaviKorisnika(email,password);              
        }  
    }
}