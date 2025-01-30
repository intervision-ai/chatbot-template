import React, { useState } from 'react';

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageClick = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center my-2 text-sm text-gray-800">
      <button
        className={`px-3 py-1 border mx-0.5 bg-white/90 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className={`px-3 py-1 border mx-0.5 bg-[#04ADEF] text-white rounded-md`}>
        {currentPage}
      </span>
      <button
        className={`px-3 py-1 border mx-0.5 bg-white/90 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <div className='text-sm ml-4'>
        Showing {currentPage*itemsPerPage -itemsPerPage}-{totalPages === currentPage ? totalItems: itemsPerPage* currentPage} of {totalItems}
      </div>
    </div>
  );
};

export default Pagination;