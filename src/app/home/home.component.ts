import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbInputDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgProgress } from 'ngx-progressbar';
import { TrackingService } from '../service/tracking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbInputDatepickerConfig,NgbTimepickerConfig,NgbNavConfig]
})
export class HomeComponent implements OnInit {

  public options = {
    minimum: 0.08,
    maximum: 1,
    ease: 'linear',
    speed: 200,
    trickleSpeed: 300,
    meteor: true,
    spinner: true,
    spinnerPosition: 'right',
    direction: 'leftToRightIncreased',
    color: 'blue',
    thick: true,
  };


  startedClass = false;
  endedClass = false;
  preventAbuse = false;

  constructor(configs: NgbTimepickerConfig, private calendar: NgbCalendar,config: NgbNavConfig, private trackingServer:TrackingService,public progress: NgProgress) {
    config.destroyOnHide = false;
    config.roles = false;
    configs.seconds = true;
    configs.spinners = false; } 

  
  public today = this.calendar.getToday() 
  public model: NgbDateStruct = {year:2021, month:11, day:1};
  public model1: NgbDateStruct = {year:2021, month:11, day:1};
  public value:number=0
  public notif:string="";
  public token:string="";
  public fillters:string="";
  public idGoogleSheet:string="";
  public idSongArtis:string="";
  public idPlaylist:string="";
  public startDate:string="";
  public endDate:string="";
  public isProgressbar:boolean = false;
  public isNotif:boolean = false;
  public titleFunctionList:string ="Fillter days"
  public mainFunction: Array<any> = [
    {id: 0, name: ""},
    {id: 1, name: "24 hours", fillter:"1day"},
    {id: 2, name: "7 days", fillter:"7day"},
    {id: 3, name: "28 days", fillter:"28day"},
    {id: 4, name: "12 months" , fillter:"1year"},
    {id: 5, name: "Since 2015", fillter:"last5years"},
    {id: 6, name: "All times", fillter:"all"}  
  ]
  public file:any

  ngOnInit(): void {

  }

  public selectFunctionList(item:any){
    this.titleFunctionList = item.name
    this.fillters = item.fillter
  }

  public checkProgressbar(){
    if(this.isProgressbar == false && this.value <94){
      this.value = this.value + 1;
    }
  }

  public trackingSpotifyClick(){
    this.value = 0
    this.isNotif = true
    this.notif = "Tracking daily loading!!"
    setInterval(() => {
      this.checkProgressbar()
    }, 1000);
    var listIdSongArtis = ""
    var splitData = this.idSongArtis.split('\n')
    for(let i =0;i<splitData.length ; i++){
      if(i == 0){
        listIdSongArtis = splitData[i];
      }else{
        listIdSongArtis = listIdSongArtis + ";"+splitData[i]
      }
      var listIdPlaylist = ""
      if(i == splitData.length - 1){
        var splitDataPlaylist = this.idPlaylist.split('\n')
        for(let j =0;j<splitDataPlaylist.length ; j++){
          if(j == 0){
            listIdPlaylist = splitDataPlaylist[j];
          }else{
            listIdPlaylist = listIdPlaylist + ";"+splitDataPlaylist[j]
          }
          if(j == splitDataPlaylist.length - 1){
            var val = {
              listID:listIdSongArtis,
              listIDPlaylist:listIdPlaylist,
              bearToken:this.token,
              sheetID:this.idGoogleSheet
            }
            // var val = "?listID="+ this.listIdSongArtis+ "&listIDPlaylist="+ this.listIdPlaylist +"&bearToken="+ this.token+"&sheetID="+ this.idGoogleSheet
            this.trackingServer.trackingSpotify(val).subscribe(res=>{
              this.isProgressbar = true;
              this.notif = "Tracking daily successfully!!"
              this.value = 100
              console.log(res)
              if(res != "Done"){
                alert(res)
              }
            })
          }
        }
      }
    }
   
    
  }

  public trackingStreamClick(){
    this.value = 0
    this.isNotif = true
    this.notif = "Tracking monthly loading!!"
    setInterval(() => {
      this.checkProgressbar()
    }, 1000);
    var day = ""
    var day1 = ""
    if(this.model.day <10){
      day = "0" + this.model.day.toString()
    }else{
      day = this.model.day.toString()
    }
    if(this.model1.day <10){
      day1 = "0" + this.model1.day.toString()
    }else{
      day1 = this.model1.day.toString()
    }
    var splitData = this.idSongArtis.split('\n')
    var listIdSongArtis = ""
    for(let i =0;i<splitData.length ; i++){
      if(i == 0){
        listIdSongArtis = splitData[i];
      }else{
        listIdSongArtis = listIdSongArtis + ";"+splitData[i]
      }
      if(i == splitData.length-1){
        this.startDate = this.model.year.toString() +"-"+ this.model.month.toString() +"-"+ day
        this.endDate = this.model1.year.toString() +"-"+ this.model1.month.toString() +"-"+ day1
        var val = {
          listID:listIdSongArtis,
          bearToken:this.token,
          sheetID:this.idGoogleSheet,
          startDate:this.startDate,
          endDate:this.endDate,
          fillters:this.fillters
        }
        // var val = "?listID="+ this.listIdSongArtis +"&bearToken="+ this.token+"&sheetID="+ this.idGoogleSheet+ "&startDate="+ this.startDate+
        // "&endDate="+ this.endDate+"&fillters="+ this.fillters
        this.trackingServer.trackingStreams(val).subscribe(res=>{
          this.isProgressbar = true;
          this.value = 100
          this.notif = "Tracking monthly successfully!!"
          console.log(res)
          if(res != "Done"){
            alert(res)
          }
        })
      }
    }
  }


  // public uploadFile = (files:any) => {
  //   if (files.length === 0) {
  //     return;
  //   }
  //   let fileToUpload = <File>files[0];
  //   this.file = files
  //   this.fileNameIdPlaylist = " ----- "+ fileToUpload.name
  //   console.log('Upload',this.file)
  // }
  // public uploadFileIDSong = (files:any) => {
  //   if (files.length === 0) {
  //     return;
  //   }
  //   let fileToUpload = <File>files[0];
  //   this.file = files
  //   this.fileNameIdSong = " ----- "+ fileToUpload.name
  //   console.log('Upload',this.file)
  // }
}
