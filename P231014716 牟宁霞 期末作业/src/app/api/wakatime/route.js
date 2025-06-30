import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Received WakaTime API request');
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'WAKATIME_API_KEY environment variable not set' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://wakatime.com/api/v1/users/current/stats/last_7_days',
      { headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}` } }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`WakaTime API Error: ${response.status} - ${errorDetails}`);
      throw new Error(`Failed to fetch WakaTime data (Status: ${response.status})`);
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Fetch error details:', error);
    return NextResponse.json(
      { error: `Fetch failed: ${error.message}` },
      { status: 500 }
    );
  }
}