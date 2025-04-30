import React from "react";

interface PagProps {
  currentPage: number;
  totalPages: number; // Added prop for total pages
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PagProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = []; // Array to store the page numbers to display
    const maxPagesToShow = 5; // Maximum number of page buttons to display at once

    // Calculate the starting page number.
    // Ensures we don't start below page 1 and centers around the current page.
    // 1 , 1-2 = 1
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));

    // Calculate the ending page number.
    // Ensures we don't exceed the total number of pages.
    // 3 , 1 +5-1 =3
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust the start page if there aren't enough pages to display after it.
    // This ensures we always display the maximum number of pages if possible.
    // 3 - 1 < 5-1 = true
    if (endPage - startPage < maxPagesToShow - 1) {
      // 1, 3-5+1 =1
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Generate the range of pages from startPage to endPage.
    // This loop populates the pages array with the appropriate page numbers.
    for (let i = startPage; i <= endPage; i++) {
      // 1 -> 3
      pages.push(i);
    }

    return pages; // Return the array of page numbers to display
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination !relative flex items-center">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="join-item btn"
      >
        «
      </button>

      <div className="flex">
        {pageNumbers.map((page, index) => (
          <button
            key={page}
            className={`w-[48px] h-[48px] !rounded-md mx-1 ${
              currentPage === page
                ? "bg-base-300"
                : "bg-base-200 hover:bg-base-300"
            }
            ${index === 0 ? "first_page" : ""} ${
              index === pageNumbers.length - 1 ? "last_page" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="join-item btn"
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
