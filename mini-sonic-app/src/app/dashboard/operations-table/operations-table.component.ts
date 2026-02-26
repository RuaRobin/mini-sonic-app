import { type Operation, OPERATIONS } from '../../dummydata/operation';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OperationViewComponent } from '../operation-view/operation-view.component'
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-operations-table',
  standalone: false,
  templateUrl: './operations-table.component.html',
  styleUrl: './operations-table.component.css',
})
export class OperationsTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['operationID',
    'operationType',
    'operationCustomer',
    'operationDate',
    'netTotal',
    'grossTotal',
    'actions'];

  dataSource = new MatTableDataSource<Operation>(OPERATIONS);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog:MatDialog){}
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

  onEdit(row: Operation) {
    console.log('Edit: ', row);
  }
  
  onDelete(row: Operation) {
    this.dataSource.data = this.dataSource.data.filter(o => o.operationID !== row.operationID)
  }

  onViewOperation(row:Operation) {
    console.log("viewing item");
    this.dialog.open(OperationViewComponent, {
      data: row,
      width: '620px',
      maxHeight: '90vh',
      panelClass: 'operation-dialog'
    });
  
  }








}
