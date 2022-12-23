import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {TokenStorageService} from "../services/token-storage.service";
import {Seller} from "../entities/Seller";
import {SellerService} from "../services/seller.service";
import {parseDateToString, parseStringToDate} from "../helpers/help-functions";
import {SellerDialogComponent} from "./seller-dialog/seller-dialog.component";

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'fio', 'birthday', 'gender', 'title', 'companyName', 'phone'];
  dataSource: MatTableDataSource<Seller> = new MatTableDataSource<Seller>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Seller>(false, []);

  role: string | undefined;

  constructor(public dialog: MatDialog, private sellerService: SellerService,
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
  checkboxLabel(row?: Seller): string {
    return `${this.selection.isSelected(<Seller>row) ? 'deselect' : 'select'}`;
  }

  //---------------------------------------------------
  getAllData() {
    this.sellerService.getSellers()
      .subscribe({
        next: data => {
          data.map(value => {
            value.birthday = parseStringToDate(value.birthday)
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
    this.dialog.open(SellerDialogComponent)
      .afterClosed().subscribe((data) => {
      if (data) {
        this.getAllData();
      }
    });
  }

  openUpdateDataDialog() {
    this.dialog.open(SellerDialogComponent, {
      data: this.selection.selected[0]
    }).afterClosed().subscribe(data => {
      if (data) {
        this.getAllData();
        this.selection.clear();
      }
    });
  }

  openDeleteDataDialog() {
    this.sellerService.deleteSeller(this.selection.selected[0]?.id).subscribe({
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
