import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {TokenStorageService} from "../services/token-storage.service";
import {BuyerDialogComponent} from "./buyer-dialog/buyer-dialog.component";
import {Buyer} from "../entities/Buyer";
import {BuyerService} from "../services/buyer.service";
import {parseDateToString, parseStringToDate} from "../helpers/help-functions";

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'fio', 'birthday', 'gender', 'phone', 'email'];
  dataSource: MatTableDataSource<Buyer> = new MatTableDataSource<Buyer>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Buyer>(false, []);

  role: string | undefined;

  constructor(public dialog: MatDialog, private buyerService: BuyerService,
              private tokenStorage: TokenStorageService) {
  }

  ngOnInit(): void {
    this.role = this.tokenStorage.getUser().role;
    this.getAllData();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = (record, filter) => {
      const dataStr = Object.keys(record)
        .reduce((currentTerm: string, key: string) => {
          let element;
          if (key === 'birthday') element = parseDateToString((record as { [key: string]: any })[key]);
          else element = (record as { [key: string]: any })[key];
          return currentTerm + element + '◬';
        }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
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
  checkboxLabel(row?: Buyer): string {
    return `${this.selection.isSelected(<Buyer>row) ? 'deselect' : 'select'}`;
  }

  //---------------------------------------------------

  getAllData() {
    this.buyerService.getBuyers()
      .subscribe({
        next: data => {
          data.map(value => {value.birthday = parseStringToDate(value.birthday)});
          this.dataSource.data = data;
        },
        error: err => {
          alert(err.message);
          return [];
        }
      });
  }

  openAddDataDialog() {
    this.dialog.open(BuyerDialogComponent).afterClosed().subscribe((data) => {
      if (data) {
        this.getAllData();
      }
    });
  }

  openUpdateDataDialog() {
    this.dialog.open(BuyerDialogComponent, {
      data: this.selection.selected[0]
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllData();
        this.selection.clear();
      }
    });
  }

  openDeleteDataDialog() {
    this.buyerService.deleteBuyer(this.selection.selected[0]?.id).subscribe({
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
