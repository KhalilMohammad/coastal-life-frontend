import Pagination from "./Pagination";

const Table = ({ data, perPage, currentPage, setCurrentPage, totalItems }) => {
  let columns = [];

  if (Array.isArray(data) && data.length > 0) {
    columns = Object.keys(data[0]);
  }

  console.log("Data received:", data);
  console.log("column", columns);

  const isDateColumn = (columnName) => {
    const dateColumns = [
      "entryDate",
      "mls_failedListingDate",
      "mls_maxListPriceDate",
      "mls_minListPriceDate",
      "mls_originalListingDate",
      "mls_soldDate",
    ];
    return dateColumns.includes(columnName);
  };

  const formatDate = (value, columnName) => {
    return isDateColumn(columnName) && value
      ? new Date(value).toLocaleDateString()
      : value;
  };

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  let paginatedData = [];

  if (Array.isArray(data) && data.length > 0) {
    paginatedData = data.slice(startIndex, endIndex);
  }

  if (data.length === 0) {
    return (
      <div className="mt-4 text-center">
        <p className="text-red-500">No data found</p>
      </div>
    );
  }

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="max-h-96 overflow-x-auto mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 ${
                    index === 0
                      ? "rounded-s-lg"
                      : index === columns.length - 1
                      ? "rounded-e-lg"
                      : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white dark:bg-gray-800">
                {columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {formatDate(row[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={totalItems}
        itemsPerPage={perPage}
        currentPage={currentPage}
        onPageChange={handlePaginationChange}
      />
    </div>
  );
};

export default Table;
