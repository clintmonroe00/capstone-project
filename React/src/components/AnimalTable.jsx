import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

const AnimalTable = ({ data }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Paginate the data
  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination]);

  // Column helper and definitions
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor("rec_num", {
        header: "Record Number",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("animal_id", {
        header: "Animal ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("animal_type", {
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("breed", {
        header: "Breed",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("color", {
        header: "Color",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("date_of_birth", {
        header: "Date of Birth",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString("en-US")
            : "N/A",
      }),
      columnHelper.accessor("date_of_outcome", {
        header: "Date of Outcome",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue()).toLocaleDateString("en-US")
            : "N/A",
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue() || "Unknown",
      }),
      columnHelper.accessor("outcome_subtype", {
        header: "Outcome Subtype",
        cell: (info) => info.getValue() || "N/A",
      }),
      columnHelper.accessor("outcome_type", {
        header: "Outcome Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("sex_upon_outcome", {
        header: "Sex Upon Outcome",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("location_lat", {
        header: "Latitude",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("location_long", {
        header: "Longitude",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("age_upon_outcome", {
        header: "Age Upon Outcome",
        cell: (info) => info.getValue() || "N/A",
      }),
    ],
    [columnHelper]
  );

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
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-center">
                    <div
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                        className: header.column.getCanSort() ? "cursor-pointer" : "",
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
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <select
            className="form-select"
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
        <div className="pagination-controls">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="mx-2">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalTable;