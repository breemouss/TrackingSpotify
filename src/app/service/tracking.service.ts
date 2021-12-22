import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http:HttpClient,@Inject('BASE_API_URL') private baseUrl: string) { }

  trackingStreams(val:any){
    return this.http.post(this.baseUrl + 'trackingMonthly', val, {responseType:"text"})
  }
  trackingSpotify(val:any){
    return this.http.post(this.baseUrl + 'trackingDaily', val, {responseType:"text"})
  }
}
