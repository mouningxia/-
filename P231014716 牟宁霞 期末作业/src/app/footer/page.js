'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [codingTime, setCodingTime] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWakaTimeData = async () => {
      try {
        const response = await fetch('/api/wakatime');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const data = await response.json();
        const totalTime = data.data?.human_readable_total || 'No data';
        setCodingTime(totalTime);
      } catch (err) {
        setError('Unable to load coding time data');
        console.error(err);
      }
    };

    fetchWakaTimeData();
  }, []);

  return (
    <footer className="bg-background text-foreground p-2 mt-auto h-12">
      <div className="container mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} My App</p>
          <p>{error ? error : `Coding Time This Week: ${codingTime}`}</p>
        </div>
    </footer>
  );
}