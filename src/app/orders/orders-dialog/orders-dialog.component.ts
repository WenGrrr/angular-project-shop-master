import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {OrdersService} from "../../services/orders.service";
import {Seller} from "../../entities/Seller";
import {Product} from "../../entities/Product";

@Component({
  selector: 'app-orders-dialog',
  templateUrl: './orders-dialog.component.html',
  styleUrls: ['./orders-dialog.component.css']
})
export class OrdersDialogComponent implements OnInit {
  form: FormGroup;
  actionBtn: string = "Добавить";
  submitClick: boolean = false;
  products!: Product[];
  sellers!: Seller[];


  constructor(
    public dialogRef: MatDialogRef<OrdersDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private ordersService: OrdersService) {
    this.form = this.fb.group({
      passtype: [null, [Validators.required]],
      price: [null, [Validators.required]],
      countProduct: [null, [Validators.required]],
      productidfk: [null],
      selleridfk: [null]
    });
  }

  ngOnInit(): void {
    this.products = this.data[0];
    this.sellers = this.data[1];
    if (this.data[2]) {
      this.actionBtn = "Изменить";
      this.form.controls["passtype"].setValue(this.data[2].passtype);
      this.form.controls["price"].setValue(this.data[2].price);
      this.form.controls["countProduct"].setValue(this.data[2].countProduct);
      this.form.controls["productidfk"].setValue(this.data[2].productidfk);
      this.form.controls["selleridfk"].setValue(this.data[2].selleridfk);
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
    this.ordersService.createOrders(this.form.value).subscribe({
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
    this.ordersService.updateOrders(this.data[2].id, this.form.value).subscribe(
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
