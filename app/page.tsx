"use client";

import { TbCoinBitcoin } from "react-icons/tb";
import { MdArrowOutward } from "react-icons/md";
import { useEffect, useState } from "react";
import { api } from "./api";

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news?category=general');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1246px] max-[1246px]:px-4 pb-20">

        {/* Logo */}
        <div className="w-full flex justify-center mt-[44px]">
          <img src="/images/logo/blott.png" alt="Next.js logo" className="w-full max-w-[200px]" />
        </div>

        {/* Title Desktop */}
        <div className="max-[990px]:hidden text-[80px] uppercase mt-[100px]">
          <h1>latest news</h1>
          <div className="flex items-center space-x-6 mt-[-48px]">
            <h1 className="font-['Albra']">from</h1>
            <hr className="text-white/60 w-full max-w-[193px]" />
            <div className="relative">
              <h1>the world</h1>
              <TbCoinBitcoin className="text-4xl absolute right-[-30px] top-0 rotate-15" />
            </div>
          </div>
        </div>

        {/* Title Mobile */}
        <h1 className="max-[990px]:block hidden text-[40px]/12 uppercase mt-[58px] font-['Helvetica_Now_Display'] line">latest news from the world of finance</h1>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg bg-gray-800/50 ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className="relative w-full h-full min-h-[300px] animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className={`space-y-3 ${index === 0 ? 'lg:space-y-4' : ''}`}>
                      <div className={`h-6 bg-gray-700/50 rounded ${
                        index === 0 ? 'lg:h-8 w-3/4' : 'w-full'
                      }`} />
                      <div className={`h-6 bg-gray-700/50 rounded ${
                        index === 0 ? 'lg:h-8 w-1/2' : 'w-2/3'
                      }`} />
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-4 w-24 bg-gray-700/50 rounded" />
                        <div className="h-4 w-20 bg-gray-700/50 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]">
            {news.map((item, index) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-lg ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className="relative w-full h-full min-h-[300px]">
                  <img
                    src={item.image}
                    alt={item.headline}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className={`font-['Helvetica_Now_Display'] font-bold mb-3 ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-lg'
                    }`}>
                      {item.headline}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">
                        {formatDate(item.datetime)}
                      </span>
                      <div className="flex items-center gap-1 text-sm">
                        <span>Read Article</span>
                        <MdArrowOutward className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
