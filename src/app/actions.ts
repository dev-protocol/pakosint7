"use server";

import * as cheerio from "cheerio";
import { z } from "zod";
import type { ApiResponse, SearchResult } from "@/lib/types";

const TARGET_BASE = "https://pakistandatabase.com";
const TARGET_PATH = "/databases/sim.php";
const MIN_INTERVAL = 1.0; // seconds
const COPYRIGHT_NOTICE = "Data provided for informational purposes only.";

// In-memory store for rate limiting. NOTE: This is not suitable for a multi-instance serverless environment.
// It works here because apphosting.yaml specifies maxInstances: 1.
const LAST_CALL = { ts: 0.0 };

const QuerySchema = z.string()
  .min(1, "Query cannot be empty.")
  .refine(value => {
    const v = value.trim();
    return /^(92\d{9,12}|\d{13})$/.test(v);
  }, "Invalid query. Use mobile with country code (e.g., 923...) or a 13-digit CNIC.");

type ActionState = {
  data: ApiResponse | null;
  error: string | null;
  loading: boolean;
};

function classifyQuery(value: string): { type: "mobile" | "cnic"; normalized: string } {
    const v = value.trim();
    if (/^92\d{9,12}$/.test(v)) {
        return { type: "mobile", normalized: v };
    }
    if (/^\d{13}$/.test(v)) {
        return { type: "cnic", normalized: v };
    }
    throw new Error("Invalid query format.");
}

async function rateLimitWait(): Promise<void> {
    const now = Date.now();
    const elapsed = (now - LAST_CALL.ts) / 1000;
    if (elapsed < MIN_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, (MIN_INTERVAL - elapsed) * 1000));
    }
    LAST_CALL.ts = Date.now();
}

async function fetchUpstream(queryValue: string): Promise<string> {
    await rateLimitWait();
    const url = `${TARGET_BASE.replace(/\/$/, "")}${TARGET_PATH}`;
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `${TARGET_BASE.replace(/\/$/, "")}/`,
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    
    const body = new URLSearchParams({ search_query: queryValue });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: body.toString(),
        });

        if (!response.ok) {
            throw new Error(`Upstream fetch failed with status: ${response.status}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error("Upstream fetch error:", error);
        throw new Error("Failed to connect to the upstream data source.");
    }
}

function parseTable(html: string): SearchResult[] {
    const $ = cheerio.load(html);
    const table = $("table.api-response, table").first();
    const results: SearchResult[] = [];

    if (!table.length) return results;

    table.find("tbody tr").each((_, row) => {
        const cols = $(row)
            .find("td")
            .map((__, col) => $(col).text().trim())
            .get();
        
        results.push({
            mobile: cols[0] || null,
            name: cols[1] || null,
            cnic: cols[2] || null,
            address: cols[3] || null,
        });
    });

    return results;
}

export async function lookupAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const query = formData.get("query");

    const validationResult = QuerySchema.safeParse(query);
    if (!validationResult.success) {
        return { 
            data: null, 
            error: validationResult.error.errors[0].message,
            loading: false,
        };
    }
    const validatedQuery = validationResult.data;

    try {
        const { type, normalized } = classifyQuery(validatedQuery);
        
        const html = await fetchUpstream(normalized);
        const results = parseTable(html);

        const response: ApiResponse = {
            query: normalized,
            query_type: type,
            results_count: results.length,
            results,
            copyright: COPYRIGHT_NOTICE,
        };

        return { data: response, error: null, loading: false };
    } catch (e) {
        const error = e instanceof Error ? e.message : "An unknown error occurred.";
        return { data: null, error, loading: false };
    }
}
