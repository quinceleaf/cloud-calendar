import React, { useState, useEffect } from "react";
import Router from "next/router";

import Link from "next/link";

import {
  MdNavigateBefore,
  MdNavigateNext,
  MdFirstPage,
  MdLastPage,
  MdMoreHoriz,
} from "react-icons/md";

const Pagination = ({ pageSize, totalObjects, page, goToPage, isFiltered }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalObjects / pageSize); i++) {
    pageNumbers.push(i);
  }

  let renderNavigation = true;
  // if (pageNumbers.length <= 10) {
  //   renderNavigation = false;
  // }

  let setActiveFirst = true;
  let setActivePrevious = true;
  let setActiveNext = true;
  let setActiveLast = true;

  if (page === 1) {
    setActiveFirst = false;
    setActivePrevious = false;
  }

  if (page === pageNumbers.length) {
    setActiveNext = false;
    setActiveLast = false;
  }

  const renderGoToFirstPage = () => {
    if (renderNavigation && setActiveFirst) {
      return (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Previous"
          onClick={() => goToPage(1)}
        >
          <MdFirstPage />
        </button>
      );
    }
    if (renderNavigation && !setActiveFirst) {
      return (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Previous"
          onClick={() => goToPage(1)}
        >
          <MdFirstPage />
        </button>
      );
    }
    return null;
  };

  const renderPrevious = () => {
    if (renderNavigation && setActivePrevious) {
      return (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 #rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500"
          aria-label="Previous"
          onClick={() => goToPage(page - 1)}
        >
          <MdNavigateBefore />
        </button>
      );
    }
    if (renderNavigation && !setActivePrevious) {
      return (
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 #rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Previous"
        >
          <MdNavigateBefore />
        </button>
      );
    }
    return null;
  };

  const renderNext = () => {
    if (renderNavigation && setActiveNext) {
      return (
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-2 py-2 #rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Next"
          onClick={() => goToPage(page + 1)}
        >
          <MdNavigateNext />
        </button>
      );
    }
    if (renderNavigation && !setActiveNext) {
      return (
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-2 py-2 #rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Next"
        >
          <MdNavigateNext />
        </button>
      );
    }
    return null;
  };

  const renderGoToLastPage = () => {
    if (renderNavigation && setActiveLast) {
      return (
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Next"
          onClick={() => goToPage(pageNumbers.length)}
        >
          <MdLastPage />
          <span className="mx-2">{pageNumbers.length} pages</span>
        </button>
      );
    }
    if (renderNavigation && !setActiveLast) {
      return (
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 "
          aria-label="Next"
        >
          <MdLastPage />
          <span className="mx-2">{`${pageNumbers.length} ${
            pageNumbers.length > 1 ? "pages" : "page"
          }`}</span>
        </button>
      );
    }
    return null;
  };

  const renderSkippedPages = () => {
    return (
      <li className="block hover:text-white hover:bg-green-400 text-sm text-gray-500 border-r border-grey-light px-3 py-2">
        <MdMoreHoriz />
      </li>
    );
  };

  const renderPageNumbers = () => {
    if (renderNavigation) {
      let pageRange = [];
      if (pageNumbers.length === 1) {
        pageRange = [1];
      } else if (pageNumbers.length === 2) {
        pageRange = [1, 2];
      } else if (page === 1) {
        pageRange = [1, 2, 3];
      } else if (page === pageNumbers.length) {
        pageRange = [page - 2, page - 1, page];
      } else {
        pageRange = [page - 1, page, page + 1];
      }

      return pageRange.map((number) =>
        number === page ? (
          <button
            key={number}
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700  bg-blue-300 text-white "
            onClick={() => goToPage(number)}
          >
            {number}
          </button>
        ) : (
          <button
            key={number}
            type="button"
            className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700  text-gray-500 "
            onClick={() => goToPage(number)}
          >
            {number}
          </button>
        )
      );
    }
  };

  return (
    <div className=" mt-4">
      <nav className="relative z-0 inline-flex shadow-sm">
        {renderGoToFirstPage()}
        {renderPrevious()}
        {renderPageNumbers()}
        {renderNext()}
        {renderGoToLastPage()}
      </nav>
    </div>
  );
};

export default Pagination;
