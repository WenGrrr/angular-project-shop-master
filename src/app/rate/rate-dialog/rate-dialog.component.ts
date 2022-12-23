import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Buyer} from "../../entities/Buyer";
import {RateService} from "../../services/rate.service";
import * as moment from "moment";

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.css']
})
export class RateDialogComponent implements OnInit {
  form: FormGroup;
  actionBtn: string = "Добавить";
  submitClick: boolean = false;
  buyers!: Buyer[];
  maxDate: any = moment();


  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private rateService: RateService) {
    this.form = this.fb.group({
      evaluation: [null, [Validators.required]],
      buydate: [null, [Validators.required]],
      buyeridfk: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.buyers = this.data[0];
    if (this.data[2]) {
      this.actionBtn = "Изменить";
      this.form.controls["evaluation"].setValue(this.data[2].evaluation);
      this.form.controls["buydate"].setValue(this.data[2].buydate);
      this.form.controls["buyeridfk"].setValue(this.data[2].buyeridfk);
    }
  }

  onSubmit(): void {
    if (!this.data[2]) {
      this.addData();
    } else {
      this.updateData();
    }
  }

  addData() {
    this.rateService.createRate(this.form.value, this.data[1]).subscribe({
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
    this.rateService.updateRate(this.data[2].id, this.form.value, this.data[1]).subscribe(
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
