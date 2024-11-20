import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

const AnimalTable = ({ data, onDelete }) => {
  const navigate = useNavigate();
  
   // State variables for table sorting, global search filter, and pagination
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index
    pageSize: 5,  // Number of rows per page
  });

  // Filter data based on the global search input
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(globalFilter.toLowerCase())
    );
  }, [data, globalFilter]);

   // Paginate the filtered data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // Calculate the total number of pages
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);

  // Helper for defining and formatting table columns
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('animal_type', {
        header: 'Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('breed', {
        header: 'Breed',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('color', {
        header: 'Color',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('date_of_birth', {
        header: 'Date of Birth',
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString('en-US')
            : 'N/A',
      }),
      columnHelper.accessor('date_of_outcome', {
        header: 'Date of Outcome',
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString('en-US')
            : 'N/A',
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue() || 'Unknown',
      }),
      columnHelper.accessor('outcome_type', {
        header: 'Outcome Type',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('age_upon_outcome', {
        header: 'Age Upon Outcome',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('sex_upon_outcome', {
        header: 'Sex Upon Outcome',
        cell: (info) => info.getValue() || 'N/A',
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='d-flex justify-content-center'>
            <button
              className='btn btn-sm btn-primary me-2'
              onClick={() => navigate(`/animal/${row.original.rec_num}/edit`)}
            >
              Edit
            </button>
            <button
              className='btn btn-sm btn-danger'
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this animal?')) {
                  onDelete(row.original.rec_num);
                }
              }}
            >
              Delete
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper, navigate, onDelete]
  );

  // Configure the table instance with data, columns, and states
  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <input
          type='text'
          placeholder='Search...'
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='form-control'
          style={{ width: '25%' }}
        />
        <button
          className='btn btn-primary'
          onClick={() => navigate('/add-animal')}
        >
          Add Animal
        </button>
      </div>
      <div className='table-responsive'>
        {filteredData.length === 0 ? (
          <div className='text-center'>No animals available to display in the table.</div>
        ) : (
          <table className='table table-bordered table-hover table-striped'>
            <thead className='thead-light'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className='text-start'>
                      <div
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                          className: header.column.getCanSort() ? 'cursor-pointer' : '',
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {filteredData.length > 0 && (
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <div>
            <select
              className='form-select'
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 30].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div className='pagination-controls'>
            <button
              className='btn btn-sm btn-outline-primary'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className='btn btn-sm btn-outline-primary'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <span className='mx-2'>
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className='btn btn-sm btn-outline-primary'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className='btn btn-sm btn-outline-primary'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalTable;