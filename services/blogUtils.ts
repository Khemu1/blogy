import { SearchParams } from "@/types";
import { NextRequest } from "next/server";

export const getBlogsParams = (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  let searchParams: SearchParams = {};
  const sorting = p.get("sortBy");

  let ordering: [string, "ASC" | "DESC"] = ["createdAt", "DESC"];
  searchParams.q = p.get("q");
  searchParams.searchBy = p.get("searchBy") as
    | "author"
    | "title"
    | "content"
    | null;

  switch (sorting) {
    case "create-d-asc":
      ordering = ["createdAt", "ASC"];
      break;
    case "create-d-desc":
      ordering = ["createdAt", "DESC"];
      break;
    case "update-d-asc":
      ordering = ["updatedAt", "ASC"];
      break;
    case "update-d-desc":
      ordering = ["updatedAt", "DESC"];
      break;
    default:
      ordering = ["createdAt", "DESC"];
  }
  return { searchParams, ordering };
};

export const getPageNumber = (req: NextRequest) => {
  const p = req.nextUrl.searchParams;
  const page = parseInt(p.get("page")?? "1", 10);
  if (isNaN(page) || page < 1) return 1;
  return page;
}