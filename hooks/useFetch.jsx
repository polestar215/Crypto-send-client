import { useEffect, useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

const giphyFetch = new GiphyFetch(process.env.GIPHY_API_KEY);

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  useEffect(() => {
    const fetchGif = async () => {
      try {
        const { data } = await giphyFetch.search(keyword, { limit: "1" });
        setGifUrl(data[0]?.images?.downsized_medium?.url);
      } catch (error) {
        console.log(error);
        setGifUrl(
          "https://media4.giphy.com/media/gw3IWyGkC0rsazTi/giphy.gif?cid=7856026482k4vbsrla7omjtohqg3e8673z9t2r813uc9aotr&rid=giphy.gif&ct=g",
        );
      }
    };

    fetchGif();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
