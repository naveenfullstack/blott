import { NextResponse } from 'next/server';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch news with retry logic
 */
async function fetchNewsWithRetry(url: string, headers: Record<string, string>, retries = MAX_RETRIES): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (response.ok) {
        return response;
      }

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Retry on server errors (5xx)
      if (i < retries - 1) {
        await sleep(RETRY_DELAY * (i + 1)); // Exponential backoff
        continue;
      }

      return response;
    } catch (error) {
      if (i < retries - 1) {
        await sleep(RETRY_DELAY * (i + 1));
        continue;
      }
      throw error;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * GET /api/news
 * Fetches news from external API with proper error handling
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const version = process.env.NEXT_PUBLIC_VERSION;
    const headerKey = process.env.NEXT_PUBLIC_HEADER_1_KEY;
    const headerValue = process.env.NEXT_PUBLIC_HEADER_1_VALUE;

    // Validate environment variables
    if (!baseUrl || !version || !headerKey || !headerValue) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const url = `${baseUrl}${version}/news?category=general`;

    const response = await fetchNewsWithRetry(url, {
      [headerKey]: headerValue,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`API error: ${response.status} - ${errorText}`);
      
      return NextResponse.json(
        { 
          error: response.status === 401 
            ? 'Authentication failed' 
            : response.status === 429
            ? 'Rate limit exceeded. Please try again later.'
            : 'Failed to fetch news from external API' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validate response data
    if (!Array.isArray(data)) {
      console.error('Invalid response format: expected array');
      return NextResponse.json(
        { error: 'Invalid response format from API' },
        { status: 500 }
      );
    }

    // Filter out invalid news items
    const validNews = data.filter(item => 
      item &&
      typeof item.id === 'number' &&
      typeof item.headline === 'string' &&
      typeof item.url === 'string' &&
      typeof item.datetime === 'number'
    );

    return NextResponse.json(validNews, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in news API route:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while fetching news' 
      },
      { status: 500 }
    );
  }
}
