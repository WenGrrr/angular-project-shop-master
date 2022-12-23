import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../services/product.service";
import {Product} from "../../entities/Product";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  actionBtn: string = "Добавить";
  submitClick: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: Product,
    private productService: ProductService) {
    this.form = this.fb.group({
      productname: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.editData) {
      this.actionBtn = "Изменить";
      this.form.controls["productname"].setValue(this.editData.productname);
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
    this.productService.createProduct(this.form.value).subscribe({
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
    this.productService.updateProduct(this.editData.id, this.form.value).subscribe(
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
