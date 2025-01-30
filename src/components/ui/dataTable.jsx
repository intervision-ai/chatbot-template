import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const DataTable = ({
  data,
  columns,
  onDelete,
  onEdit,
  actions,
  onSelect,
  rowSelectable = true,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterText, setFilterText] = useState("");

  // Sorting Logic
  const sortData = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig) {
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortConfig]);

  useEffect(() => {
    const lowercasedFilter = filterText.toLowerCase();
    const filtered = data.filter((item) =>
      columns.some((column) =>
        item[column.key]?.toString().toLowerCase().includes(lowercasedFilter)
      )
    );
    setFilteredData(filtered);
  }, [filterText, data, columns]);

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
    onSelect(id);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl">
      <div className="mb-6 flex justify-end">
        {rowSelectable && (
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Filter by any field..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            />
          </div>
        )}
      </div>
      <div className="relative overflow-hidden">
        <div className="max-h-[450px] overflow-auto">
          <table className="w-full border-collapse relative">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {rowSelectable && (
                  <th className="px-4 py-3 bg-gray-50 text-start">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredData.map((item) => item[columns[0].key]));
                          for (const data of filteredData) {
                            onSelect(data[columns[0].key]);
                          }
                        } else {
                          setSelectedRows([]);
                          onSelect("", "clear");
                        }
                      }}
                      checked={selectedRows.length === filteredData.length}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <>
                    {column.key !== "Sr" && (
                      <th
                        key={column.key}
                        className="px-4 py-3 bg-gray-50 text-start text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => sortData(column.key)}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {sortConfig?.key === column.key && (
                            <span className="text-blue-500">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                  </>
                ))}
                {actions && (
                  <th className="px-4 py-3 bg-gray-50 text-start text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr
                  key={item[columns[0].key]}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedRows.includes(item[columns[0].key]) ? "bg-blue-50" : ""
                  }`}
                >
                  {rowSelectable && (
                    <td className="px-4 py-3">
                      <div
                        onClick={() => handleSelectRow(item[columns[0].key])}
                        className="w-4 h-4 bg-white border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        {selectedRows.includes(item[columns[0].key]) && (
                          <svg
                            className="w-3 h-3 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <>
                      {column.key !== "Sr" && (
                        <td
                          onClick={() => {
                            if (rowSelectable) {
                              handleSelectRow(item[columns[0].key]);
                            }
                          }}
                          key={column.key}
                          title={item[column.key]}
                          className={`px-4 py-3 text-sm text-gray-600 max-w-[450px] truncate ${
                            rowSelectable ? "cursor-pointer" : ""
                          }`}
                        >
                          {item[column.key]}
                        </td>
                      )}
                    </>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {actions.edit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          >
                            <BiEdit className="w-5 h-5" />
                          </button>
                        )}
                        {actions.delete && (
                          <button
                            onClick={() => {
                              selectedRows.length === 0 && onDelete(item);
                            }}
                            className={`p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors ${
                              selectedRows.length > 0
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;