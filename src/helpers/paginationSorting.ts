type IOptions = {
  page?: number;
  limit?: number;
  sortOrder?: string | undefined;
  sortBy?: string | undefined;
};

type IOptionsResults = {
  page: number;
  limit: number;
  skip: number;
  totalPages: number;
  sortOrder: string;
  sortBy: string;
};
const paginationSortingHelper = (options: IOptions): IOptionsResults => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(page / limit);
  const sortBy: string = options.sortBy || "created_at";
  const sortOrder: string = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    totalPages,
    sortBy,
    sortOrder,
  };
};
export default paginationSortingHelper;
