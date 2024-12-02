import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Define valid categories and other constants
const VALID_CATEGORIES = [
  "Disposable Supplies",
  "Medical Instruments",
  "Orthodontic Supplies",
  "Dental Tools",
  "Protective Equipment", // Added this line
] as const;
const VALID_SORT_COLUMNS = ["name", "created_at", "updated_at"] as const;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY = "updated_at";

// Type definitions
type ValidCategory = (typeof VALID_CATEGORIES)[number];
type ValidSortColumn = (typeof VALID_SORT_COLUMNS)[number];

interface QueryParams {
  page: number;
  limit: number;
  branch?: number[];
  query: string;
  sortBy: ValidSortColumn;
  sortOrder: boolean;
  categories?: ValidCategory[];
}

// Type guards
function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory);
}

function isValidSortColumn(column: string): column is ValidSortColumn {
  return VALID_SORT_COLUMNS.includes(column as ValidSortColumn);
}

// Helper function to parse and validate categories
function parseCategories(categoryParam: string): ValidCategory[] | Error {
  try {
    // Split by comma and decode each category
    const categories = categoryParam
      .split(",")
      .map((cat) => decodeURIComponent(cat.trim()))
      .filter(Boolean); // Remove empty strings

    // Validate each category
    const validCategories: ValidCategory[] = [];
    const invalidCategories: string[] = [];

    categories.forEach((category) => {
      if (isValidCategory(category)) {
        validCategories.push(category);
      } else {
        invalidCategories.push(category);
      }
    });

    if (invalidCategories.length > 0) {
      throw new Error(
        `Invalid categories: ${invalidCategories.join(
          ", "
        )}. Valid categories are: ${VALID_CATEGORIES.join(", ")}`
      );
    }

    return validCategories;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("Invalid category format");
  }
}

// Parameter parsing and validation
function parseQueryParams(searchParams: URLSearchParams): QueryParams | Error {
  try {
    // Get and validate page
    const page = Math.max(
      parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10),
      1
    );

    // Get and validate limit
    const limit = Math.max(
      parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10),
      1
    );

    // Get and validate sortBy
    const sortByParam = searchParams.get("sortBy") ?? DEFAULT_SORT_BY;
    if (!isValidSortColumn(sortByParam)) {
      throw new Error(
        `Invalid sort column. Valid columns are: ${VALID_SORT_COLUMNS.join(
          ", "
        )}`
      );
    }

    // Parse and validate categories
    const categoryParam = searchParams.get("category");
    let categories: ValidCategory[] | undefined;
    if (categoryParam) {
      const parsedCategories = parseCategories(categoryParam);
      if (parsedCategories instanceof Error) {
        throw parsedCategories;
      }
      categories = parsedCategories;
    }

    // Parse branch IDs
    const branchParam = searchParams.get("branch");
    let branchIds: number[] | undefined;
    if (branchParam) {
      const branches = branchParam.split(",").filter(Boolean);
      if (branches.length > 0) {
        branchIds = branches.map((id) => {
          const parsed = parseInt(id.trim(), 10);
          if (isNaN(parsed)) {
            throw new Error(`Invalid branch ID: ${id}`);
          }
          return parsed;
        });
      }
    }

    return {
      page,
      limit,
      branch: branchIds,
      query: searchParams.get("query") ?? "",
      sortBy: sortByParam,
      sortOrder: searchParams.get("sortOrder") === "asc",
      categories,
    };
  } catch (error) {
    return error instanceof Error ? error : new Error("Invalid parameters");
  }
}

export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Parse query parameters
  const queryParams = parseQueryParams(req.nextUrl.searchParams);
  if (queryParams instanceof Error) {
    return NextResponse.json({ error: queryParams.message }, { status: 400 });
  }

  // Build the query
  let query = supabase
    .from("inventory")
    .select(
      `
      *,
      branch (
        *
      )
      `,
      { count: "exact" }
    )
    .is("deleteOn", null);

  // Apply text search if query is not empty
  if (queryParams.query) {
    query = query.ilike("name", `%${queryParams.query}%`);
  }

  // Apply sorting
  query = query.order(queryParams.sortBy, { ascending: queryParams.sortOrder });

  // Apply branch filtering
  if (queryParams.branch?.length) {
    query = query.in("branch", queryParams.branch);
  }

  // Apply category filter
  if (queryParams.categories?.length) {
    query = query.in("category", queryParams.categories);
  }

  // Apply pagination
  const from = (queryParams.page - 1) * queryParams.limit;
  const to = queryParams.page * queryParams.limit - 1;
  query = query.range(from, to);

  // Execute the query
  const { data, error, count } = await query;

  // Handle errors
  if (error) {
    console.error("Database query failed:", error);
    return NextResponse.json(
      {
        error: "Database query failed",
        details: error.message,
      },
      { status: 500 }
    );
  }

  // Return response with metadata
  return NextResponse.json({
    data,
    count,
    metadata: {
      page: queryParams.page,
      limit: queryParams.limit,
      totalPages: count ? Math.ceil(count / queryParams.limit) : 0,
      hasMore: count ? queryParams.page * queryParams.limit < count : false,
    },
    filters: {
      categories: queryParams.categories,
      branch: queryParams.branch,
      query: queryParams.query,
      sortBy: queryParams.sortBy,
      sortOrder: queryParams.sortOrder ? "asc" : "desc",
    },
  });
}
