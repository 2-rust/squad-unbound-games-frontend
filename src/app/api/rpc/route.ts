import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (for development)
// In production, consider using Redis or a proper rate limiting library
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 200; // Max 200 requests per minute per IP (increased for batched contract reads)

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limited
  }
  
  record.count++;
  return true;
}

/**
 * Proxy API route for RPC calls to avoid CORS issues
 * This route forwards RPC requests to the Shape Network RPC endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Check rate limit (only in production or if explicitly enabled)
    // In development, we rely on the actual RPC endpoint's rate limiting
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!isDevelopment) {
      const rateLimitKey = getRateLimitKey(request);
      if (!checkRateLimit(rateLimitKey)) {
        return NextResponse.json(
          { 
            error: "Rate limit exceeded",
            message: "Too many requests. Please try again later."
          },
          { 
            status: 429,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Retry-After": "60",
            },
          }
        );
      }
    }
    
    const body = await request.json();
    
    // Get the actual RPC URL from environment or use default
    // Remove trailing slash if present
    const rpcUrl = (process.env.NEXT_PUBLIC_SHAPE_RPC_URL || "https://mainnet.shape.network").replace(/\/$/, "");
    
    // Log the RPC URL being used (for debugging)
    if (process.env.NODE_ENV === "development") {
      console.log(`[RPC Proxy] Forwarding request to: ${rpcUrl}`);
    }
    
    // Forward the RPC request to the actual RPC endpoint
    // Add User-Agent and other headers that some RPC endpoints require
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Squad-Unbound/1.0",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`RPC request failed: ${response.status} ${response.statusText}`, {
        url: rpcUrl,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      
      // Handle 403 Forbidden specifically
      if (response.status === 403) {
        return NextResponse.json(
          { 
            error: "RPC access forbidden",
            message: "The RPC endpoint returned 403 Forbidden. This may indicate authentication is required or the endpoint is blocking requests.",
            details: errorText,
          },
          { 
            status: 403,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
      
      return NextResponse.json(
        { 
          error: "RPC request failed",
          message: response.statusText,
          details: errorText,
        },
        { 
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("RPC Proxy Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to proxy RPC request",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

