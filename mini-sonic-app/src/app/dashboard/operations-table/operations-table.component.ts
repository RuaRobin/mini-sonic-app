import { type Operation, OPERATIONS } from '../../dummydata/operation';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OperationViewComponent } from '../operation-view/operation-view.component';
import { OperationEditComponent } from '../operation-edit/operation-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operations-table',
  standalone: false,
  templateUrl: './operations-table.component.html',
  styleUrl: './operations-table.component.css',
})
export class OperationsTableComponent implements AfterViewInit {

  displayedColumns: string[] = [
    'operationID',
    'operationType',
    'operationCustomer',
    'operationDate',
    'netTotal',
    'grossTotal',
    'actions'
  ];


  private storageKey!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog,private authService: AuthService, private router : Router) { 
    const jwt = this.authService.getActiveUser();
    this.storageKey= `operations_${jwt.userID}`;
  }
  dataSource = new MatTableDataSource<Operation>();

  ngOnInit(): void{
    const saved = localStorage.getItem(this.storageKey);
    this.dataSource.data = saved ? JSON.parse(saved): OPERATIONS;

  }
    private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.dataSource.data));
  }
  ngAfterViewInit(): void {
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

  openEditDialog(row: Operation): void {
    const dialogRef = this.dialog.open(OperationEditComponent, {
      data: { ...row },          // pass a copy so cancelling doesn't mutate
      width: '680px',
      maxHeight: '90vh',
      panelClass: 'operation-dialog'
    });

    dialogRef.afterClosed().subscribe((updated: Operation | null) => {
      if (!updated) return;                         // user cancelled
      const data = [...this.dataSource.data];
      const index = data.findIndex(o => o.operationID === updated.operationID);
      if (index !== -1) {
        data[index] = updated;
        this.dataSource.data = data;               // triggers table rerender
        this.saveToStorage();
      }
    });
  }
  goToAdd(): void {
    this.router.navigate(['/dashboard/add-operation']);
  }
  goToAddItems(): void{
    this.router.navigate(['/dashboard/add-item']);

  }
  onEdit(event: Event, row: Operation): void {
    event.stopPropagation();                        // prevents row click from firing
    this.openEditDialog(row);
  }

  onDelete(event: Event, row: Operation): void {
    event.stopPropagation();
    this.dataSource.data = this.dataSource.data.filter(
      o => o.operationID !== row.operationID
    );
    this.saveToStorage();
  }

  onViewOperation(row: Operation): void {
    const viewRef = this.dialog.open(OperationViewComponent, {
      data: row,
      width: '620px',
      maxHeight: '90vh',
      panelClass: 'operation-dialog'
    });

    // If user clicks Edit inside the view dialog, switch to edit dialog
    viewRef.afterClosed().subscribe((action: { edit: boolean; data: Operation } | null) => {
      if (action?.edit) {
        this.openEditDialog(action.data);
      }
    });
  }
}