import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {Product} from "../entities/Product";
import {MatTableDataSource} from "@angular/material/table";
import {ProductService} from "../services/product.service";
import {TokenStorageService} from "../services/token-storage.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ProductDialogComponent} from "./product-dialog/product-dialog.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'productname'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Product>(false, []);

  role: string | undefined;

  constructor(public dialog: MatDialog, private productService: ProductService, private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.getAllData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    return `${this.selection.isSelected(<Product>row) ? 'deselect' : 'select'}`;
  }

  //---------------------------------------------------

  getAllData() {
    this.productService.getProducts()
      .subscribe({
        next: data => {
          this.dataSource.data = data;
        },
        error: err => {
          alert(err.message);
          return [];
        }
      });
  }

  openAddDataDialog() {
    this.dialog.open(ProductDialogComponent).afterClosed().subscribe((data) => {
      if (data) {
        this.getAllData();
      }
    });
  }

  openUpdateDataDialog() {
    this.dialog.open(ProductDialogComponent, {
      data: this.selection.selected[0]
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllData();
        this.selection.clear();
      }
    });
  }

  openDeleteDataDialog() {
    this.productService.deleteProduct(this.selection.selected[0]?.id).subscribe({
      next: () => {
        alert("Успешное удаление!");
        this.getAllData();
        this.selection.clear();
      },
      error: err => {
        alert("Ошибка удаления: " + err.message);
      }
    });
  }
}
