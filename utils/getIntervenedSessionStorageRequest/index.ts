import { getWindow } from "ssr-window";

export default async (url: string) => {
  const data = getWindow().sessionStorage?.getItem(url);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw error;
    }
  }

  const blob = await fetch(url);
  const json = await blob.json();

  getWindow().sessionStorage?.setItem(url, JSON.stringify(json));

  return json;
};
