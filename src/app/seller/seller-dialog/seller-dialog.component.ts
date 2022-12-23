import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment/moment";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Seller} from "../../entities/Seller";
import {SellerService} from "../../services/seller.service";

@Component({
  selector: 'app-seller-dialog',
  templateUrl: './seller-dialog.component.html',
  styleUrls: ['./seller-dialog.component.css']
})
export class SellerDialogComponent implements OnInit {
  form: FormGroup;
  actionBtn: string = "Добавить";
  submitClick: boolean = false;
  maxDate: any = moment().subtract(10, 'years');

  constructor(
    public dialogRef: MatDialogRef<SellerDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: Seller,
    private sellerService: SellerService) {
    this.form = this.fb.group({
      fio: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      gender: [null],
      title: [null],
      companyName: [null],
      phone: [null, [Validators.minLength(5), Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    if (this.editData) {
      this.actionBtn = "Изменить";
      this.form.controls["fio"].setValue(this.editData.fio);
      this.form.controls["birthday"].setValue(this.editData.birthday);
      this.form.controls["gender"].setValue(this.editData.gender);
      this.form.controls["title"].setValue(this.editData.title);
      this.form.controls["companyName"].setValue(this.editData.companyName);
      this.form.controls["phone"].setValue(this.editData.phone);
    }
  }

  onSubmit(): void {
    if (!this.editData) {
      this.addData();
    } else {
      this.updateData();
    }
  }

  addData() {
    this.sellerService.createSeller(this.form.value).subscribe({
      next: () => {
        alert("Запись успешно добавлена!");
        this.submitClick = true;
        //this.form.reset();
        //this.dialogRef.close("save");
      },
      error: err => {
        alert("Ошибка добавления записи! " + err.message);
      }
    });
  }

  updateData() {
    this.sellerService.updateSeller(this.editData.id, this.form.value).subscribe(
      {
        next: () => {
          alert("Запись успешно обновлена!");
          this.submitClick = true;
          //this.form.reset();
          //this.dialogRef.close("update");
        },
        error: err => {
          alert("Ошибка обновления записи! " + err.message);
        }
      });
  }

  onClose() {
    this.dialogRef.close(this.submitClick);
  }
}
