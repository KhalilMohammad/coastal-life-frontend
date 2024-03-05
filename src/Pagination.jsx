const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i > 0 && i <= totalItems) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="mt-4">
      <p className="text-gray-700 text-center mt-2">
        Page {currentPage} of {totalItems}
      </p>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Previous
        </button>

        {generatePageNumbers().map((pageNumber) => (
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
