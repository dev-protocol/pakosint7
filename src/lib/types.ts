export type SearchResult = {
  mobile: string | null;
  name: string | null;
  cnic: string | null;
  address: string | null;
};

export type ApiResponse = {
  query: string;
  query_type: "mobile" | "cnic";
  results_count: number;
  results: SearchResult[];
  copyright: string;
};
