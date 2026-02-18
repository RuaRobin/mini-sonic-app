import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})

export class NotificationsService {
  
  constructor(private toastr : ToastrService){}

 

  showSuccessMsg(message : string) {
    this.toastr.success(message );
 }

  showErrorMsg(message: string) {
    this.toastr.error(message );
 }

  showWarningMsg(message: string ) {
    this.toastr.warning(message);
 }
}
