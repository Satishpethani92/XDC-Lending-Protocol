import { useTransactionFilters } from "./useTransactionFilters";
import { useTransactionFormatter } from "./useTransactionFormatter";
import { useTransactionHistory } from "./useTransactionHistory";

interface UseTransactionHistoryPageParams {
  itemsPerPage?: number;
}

/**
 * All-in-one hook for transaction history pages
 * Combines fetching, filtering, pagination, and formatting
 */
export function useTransactionHistoryPage({
  itemsPerPage = 10,
}: UseTransactionHistoryPageParams = {}) {
  // Fetch transactions
  const { transactions, isLoading, error, refetch } = useTransactionHistory();

  // Filter and paginate
  const {
    filteredTransactions,
    currentPageTransactions,
    selectedFilters,
    setSelectedFilters,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
  } = useTransactionFilters({
    transactions,
    itemsPerPage,
  });

  // Format utilities
  const {
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    formatFullDate,
    getTypeColor,
  } = useTransactionFormatter();

  return {
    // Data
    transactions,
    filteredTransactions,
    currentPageTransactions,

    // Loading states
    isLoading,
    error,

    // Filters
    selectedFilters,
    setSelectedFilters,

    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,

    // Formatters
    getAssetInfo,
    formatAmount,
    formatTimestamp,
    formatFullDate,
    getTypeColor,

    // Actions
    refetch,
  };
}
