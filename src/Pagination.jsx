const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  
    if (totalItems === 0) {
      return null;
    }
  
    return (
      <div className="mt-4">
        <p className="text-gray-700 text-center mt-2">
          Page {currentPage} of {totalPages}
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Previous
          </button>
  
          {pageNumbers.map((pageNumber) => (
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
            disabled={currentPage === totalPages}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  };


export default Pagination;
