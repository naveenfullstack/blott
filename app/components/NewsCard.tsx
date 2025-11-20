import { IoArrowUpCircleOutline } from 'react-icons/io5';
import { NewsItem } from '@/app/types/news';
import { formatDate } from '@/app/utils/dateFormatter';
import Image from 'next/image';
import { useState } from 'react';

interface NewsCardProps {
    item: NewsItem;
    index: number;
    isLastElement?: boolean;
    lastElementRef?: (node: HTMLAnchorElement | null) => void;
}

export const NewsCard = ({
    item,
    index,
    isLastElement,
    lastElementRef
}: NewsCardProps) => {
    const isFirstItem = index === 0;
    const [imageError, setImageError] = useState(false);

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group ${isFirstItem ? 'lg:col-span-2' : 'col-span-1'} hover:opacity-90 transition-opacity`}
            ref={isLastElement ? lastElementRef : null}
            aria-label={`Read article: ${item.headline}`}
        >
            <article className="space-y-6 font-roboto">
                <div className="relative w-full overflow-hidden rounded-lg bg-gray-800/50">
                    {!imageError ? (
                        <Image
                            src={item.image}
                            alt={item.headline}
                            width={800}
                            height={isFirstItem ? 400 : 200}
                            className={`rounded-lg w-full h-auto object-cover ${isFirstItem ? 'min-[769px]:min-h-[400px]' : 'min-h-[200px]'
                                }`}
                            loading={index < 4 ? 'eager' : 'lazy'}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={`flex items-center justify-center bg-gray-800/50 rounded-lg ${isFirstItem ? 'min-[769px]:min-h-[400px]' : 'min-h-[200px]'
                            }`}>
                            <p className="text-gray-500 text-sm">Image unavailable</p>
                        </div>
                    )}
                </div>

                <h2 className="text-2xl capitalize line-clamp-3">
                    {item.headline}
                </h2>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2 relative w-fit group-hover:gap-3 transition-all">
                        <p className="underline underline-offset-[10px] text-sm">
                            Read Article
                        </p>
                        <IoArrowUpCircleOutline
                            className="text-2xl rotate-45 top-[-10px] right-[-28px] absolute group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                            aria-hidden="true"
                        />
                    </div>
                    <time
                        dateTime={new Date(item.datetime * 1000).toISOString()}
                        className="text-sm opacity-60"
                    >
                        {formatDate(item.datetime)}
                    </time>
                </div>
            </article>
        </a>
    );
};
