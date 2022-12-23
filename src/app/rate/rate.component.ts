import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {TokenStorageService} from "../services/token-storage.service";
import {Rate} from "../entities/Rate";
import {Buyer} from "../entities/Buyer";
import {RateService} from "../services/rate.service";
import {BuyerService} from "../services/buyer.service";
import {RateDialogComponent} from "./rate-dialog/rate-dialog.component";
import {parseDateToString, parseStringToDate} from "../helpers/help-functions";
import {OrdersComponent} from "../orders/orders.component";

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'evaluation', 'passdate', 'buyeridfk'];
  dataSource: MatTableDataSource<Rate> = new MatTableDataSource<Rate>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Rate>(false, []);
  buyers!: Buyer[];

  role: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public ordersId: number,
              public dialog: MatDialog,
              private rateService: RateService,
              private tokenStorage: TokenStorageService,
              private buyerService: BuyerService) {
  }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.getAllData();
    this.getAllBuyers();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (record, filter) => {
      const dataStr = Object.keys(record)
        .reduce((currentTerm: string, key: string) => {
          let element;
          if (key === 'buyeridfk') element = this.getBuyerNameById((record as { [key: string]: any })[key]);
          else if (key === 'buydate') element = parseDateToString((record as { [key: string]: any })[key]);
          else element = (record as { [key: string]: any })[key];
          return currentTerm + element + '◬';
        }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'buyeridfk':
          return this.buyers?.find(buyer => buyer.id == item.buyeridfk)?.fio;
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
  checkboxLabel(row?: Rate): string {
    return `${this.selection.isSelected(<Rate>row) ? 'deselect' : 'select'}`;
  }

  //---------------------------------------------------
  getBuyerNameById(id: number) {
    return this.buyers?.find(buyer => buyer.id == id)?.fio;
  }

  getAllBuyers() {
    this.buyerService.getBuyers().subscribe({
      next: data => {
        this.buyers = data;
      },
      error: err => {
        alert(err.message);
        return [];
      }
    });
  }


  getAllData() {
    console.log(this.ordersId)
    this.rateService.getRatesByIdOrders(this.ordersId).subscribe({
      next: data => {
        data.map(value => {
          value.buydate = parseStringToDate(value.buydate)
        });
        this.dataSource.data = data;
      },
      error: err => {
        alert(err.message);
        return [];
      }
    });

  }

  openAddDataDialog() {
    this.dialog.open(RateDialogComponent, {
      data: [
        this.buyers,
        this.ordersId
      ]
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.getAllData();
      }
    });
  }

  openUpdateDataDialog() {
    this.dialog.open(RateDialogComponent, {
      data: [
        this.buyers,
        this.ordersId,
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
    this.rateService.deleteRate(this.selection.selected[0]?.id).subscribe({
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
