const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the range of items to display
  const startIndex = Math.max(1, currentPage - 2);
  const endIndex = Math.min(currentPage + 2, totalPages);

  // Generate an array of page numbers to display
  const pages = [];
  for (let i = startIndex; i <= endIndex; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-4">
      <p className="text-gray-700 text-center mt-2">
        Page {currentPage} of {totalPages}
      </p>
      <p className="text-gray-700 text-center mt-2">
        Total {totalItems}
      </p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Previous
        </button>

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`ml-2 ${
              currentPage === pageNumber
                ? "bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
            } font-bold py-2 px-4 rounded`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalItems}
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
