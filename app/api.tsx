import axios from 'axios';

const domain = `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_VERSION}`;

export const api = axios.create({
  baseURL: domain,
  headers: {
    [process.env.NEXT_PUBLIC_HEADER_1_KEY!]: process.env.NEXT_PUBLIC_HEADER_1_VALUE,
  },
});

export const getNews = `${domain}/news?category=general`;
