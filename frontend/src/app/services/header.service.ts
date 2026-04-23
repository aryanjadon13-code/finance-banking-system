import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  title: string = '';
  subtitle: string = '';

  setHeader(data: { title: string; subtitle: string }) {
    this.title = data.title;
    this.subtitle = data.subtitle;
  }
}