export type OffsetPagination = {
  page: number;
  limit: number;
  offset: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function getOffsetPagination(
  page?: number,
  limit?: number,
): OffsetPagination {
  const safePage =
    typeof page === 'number' && Number.isFinite(page) && page > 0
      ? Math.floor(page)
      : DEFAULT_PAGE;
  const safeLimitValue =
    typeof limit === 'number' && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : DEFAULT_LIMIT;
  const safeLimit = Math.min(safeLimitValue, MAX_LIMIT);

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}
