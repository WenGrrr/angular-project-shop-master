import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Seller} from "../entities/Seller";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {SellerService} from "../services/seller.service";
import {TokenStorageService} from "../services/token-storage.service";
import {Orders} from "../entities/Orders";
import {OrdersService} from "../services/orders.service";
import {OrdersDialogComponent} from "./orders-dialog/orders-dialog.component";
import {ProductService} from "../services/product.service";
import {Product} from "../entities/Product";
import {RateComponent} from "../rate/rate.component";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'passtype', 'price', 'countProduct', 'productidfk', 'selleridfk'];
  dataSource: MatTableDataSource<Orders> = new MatTableDataSource<Orders>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Orders>(false, []);
  sellers!: Seller[];
  products!: Product[];

  role: string | undefined;

  constructor(public dialog: MatDialog,
              private ordersService: OrdersService,
              private tokenStorage: TokenStorageService,
              private sellerService: SellerService,
              private productService: ProductService) {
  }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.getAllData();
    this.getAllProducts();
    this.getAllSellers();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (record, filter) => {
      const dataStr = Object.keys(record)
        .reduce((currentTerm: string, key: string) => {
          let element;
          if (key === 'productidfk') element = this.getProductNameById((record as { [key: string]: any })[key]);
          else if (key === 'selleridfk') element = this.getSellerNameById((record as { [key: string]: any })[key]);
          else element = (record as { [key: string]: any })[key];
          return currentTerm + element + '◬';
        }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'productidfk':
          return this.getSellerNameById(item.productidfk);
        case 'selleridfk':
          return this.getSellerNameById(item.selleridfk);
        default: // @ts-ignore
          return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Orders): string {
    return `${this.selection.isSelected(<Orders>row) ? 'deselect' : 'select'}`;
  }

  //---------------------------------------------------
  getProductNameById(id: number) {
    return this.products?.find(product => product.id == id)?.productname;
  }

  getSellerNameById(id: number) {
    return this.sellers?.find(seller => seller.id == id)?.fio;
  }

  getAllProducts() {
    this.productService.getProducts().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        alert(err.message);
        return [];
      }
    });
  }

  getAllSellers() {
    this.sellerService.getSellers().subscribe({
      next: data => {
        this.sellers = data;
      },
      error: err => {
        alert(err.message);
        return [];
      }
    });
  }

  getAllData() {
    this.ordersService.getOrders().subscribe({
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
    this.dialog.open(OrdersDialogComponent, {
      data: [
        this.products,
        this.sellers
      ]
    })
      .afterClosed().subscribe((data) => {
      if (data) {
        this.getAllData();
      }
    });
  }

  openUpdateDataDialog() {
    this.dialog.open(OrdersDialogComponent, {
      data: [
        this.products,
        this.sellers,
        this.selection.selected[0]
      ]
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllData();
        this.selection.clear();
      }
    });
  }

  openDeleteDataDialog() {
    this.ordersService.deleteOrders(this.selection.selected[0]?.id).subscribe({
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

  openRatesDataDialog() {
    this.dialog.open(RateComponent, {
      data: this.selection.selected[0]?.id
    });
  }
}
