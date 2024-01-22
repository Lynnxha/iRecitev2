import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Main from "../layout/Main";
import ShimmerAyahs from "../components/ShimmerAyahs";
import BreadCrumbs from "../components/BreadCrumbs";

const Surah = () => {
  const location = useLocation();
  const { id } = useParams();

  // State
  const [detailSurat, setDetailSurat] = useState({});
  const [ayat, setAyat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(Array(ayat.length).fill(false));
  const [renderedAyatCount, setRenderedAyatCount] = useState(25);

  useEffect(() => {
    // Ambil data bookmark dari localStorage saat komponen pertama kali dimuat
    const dataBookmark = JSON.parse(localStorage.getItem("bookmarks"));
    if (dataBookmark) {
      setBookmarks(dataBookmark);
    }
  }, []);

  const getDetailSurah = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.quran.gading.dev/surah/${id}`);
      setDetailSurat(res.data.data);
      setAyat(res.data.data.verses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const openDesc = () => {
    const desc = document.querySelector(".desc");
    desc.classList.toggle("hidden");
  };

  const playAudio = async (i, n) => {
    const currentlyPlayingIndex = isPlaying.findIndex((playing) => playing);
    if (currentlyPlayingIndex !== -1) {
      // eslint-disable-next-line no-use-before-define
      pauseAudio(currentlyPlayingIndex, currentlyPlayingIndex, true);
    }
    const pauseBtn = document.querySelector(`.pause${n}`);
    const playBtn = document.querySelector(`.play${n}`);
    playBtn.classList.toggle("hidden");
    pauseBtn.classList.toggle("hidden");
    const audio = document.getElementById(`audio${i}`);
    audio.play();
    setIsPlaying((prevIsPlaying) => {
      const newIsPlaying = [...prevIsPlaying];
      newIsPlaying[i] = true;
      return newIsPlaying;
    });
  };

  const pauseAudio = (i, n, reset) => {
    document.querySelector(`.pause${n}`).classList.toggle("hidden");
    document.querySelector(`.play${n}`).classList.toggle("hidden");
    const audio = document.getElementById(`audio${i}`);
    if (reset) {
      audio.currentTime = 0;
    }
    audio.pause();
    setIsPlaying((prevIsPlaying) => {
      const newIsPlaying = [...prevIsPlaying];
      newIsPlaying[i] = false;
      return newIsPlaying;
    });
  };

  const setBookmark = (ayat_id) => {
    const isExist = bookmarks.includes(ayat_id);

    if (!isExist) {
      const newBookmarks = [...bookmarks, ayat_id];
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } else {
      const newBookmarks = bookmarks.filter((item) => item !== ayat_id);
      setBookmarks(newBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    }
  };

  const isMarked = (ayat_id) =>
    bookmarks.includes(ayat_id)
      ? "fa-solid text-emerald-400"
      : "fa-regular text-gray-500";

  useEffect(() => {
    // Ambil data surah saat location key berubah (navigasi)
    getDetailSurah();
  }, [location.key]);

  const link = {
    title: `${detailSurat?.name?.transliteration?.id ?? "-"}`,
    path: `/surah/${detailSurat?.number}`,
  };

  return (
    <Main>
      <div id="_surah" className="md:w-5/12 md:mx-auto bg-white min-h-screen">
        <nav className="py-6 px-7">
          <div className="flex gap-2 items-end text-gray-500">
            <BreadCrumbs link={link} loading={loading} />
            <div>
              <span id="clock" className="text-sm" />
            </div>
          </div>
        </nav>
        {loading ? (
          <ShimmerAyahs />
        ) : (
          <div className="px-7 pt-6" style={{ overflow: "hidden" }}>
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-2xl nama-surah">
                {detailSurat?.name?.short}
              </p>
              <p
                className="text-gray-800 inline font-semibold text-xl mt-2 cursor-pointer hover:underline"
                onClick={() => openDesc()}
              >
                <span className="text-justify">
                  {detailSurat?.name?.transliteration?.id}
                </span>
              </p>
              <div className="flex justify-around items-center">
                <Link
                  to={`/surah/${
                    detailSurat?.number - 1 === 0
                      ? 114
                      : detailSurat?.number - 1
                  }`}
                >
                  <i className="fa-solid fa-arrow-left" />
                </Link>
                <p className="text-gray-500 text-base mt-2 mb-4">
                  {detailSurat?.arti}
                </p>
                <Link
                  to={`/surah/${
                    detailSurat?.number + 1 === 115
                      ? 1
                      : detailSurat?.number + 1
                  }`}
                >
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
              <hr />
              <p className="text-gray-700 my-3">
                <span>{detailSurat?.revelation?.id}</span> -{" "}
                <span>{detailSurat?.numberOfVerses} Ayat</span>
              </p>
              <p className="text-gray-500 desc hidden transition-all ease duration-300">
                {detailSurat?.tafsir?.id}
              </p>
            </div>
            <div className="mt-8">
              {ayat.slice(0, renderedAyatCount).map((a, i) => (
                <div
                  className="py-6 border-b flex-column gap-4 items-start justify-between transition-all ease duration-300"
                  key={a.number.inSurah}
                >
                  <div className="flex gap-3 items-center justify-between">
                    <span className="flex justify-center items-center text-slate-500 text-sm w-10 h-10 radius border">
                      {a.number.inSurah}
                    </span>
                    <div className="flex gap-4">
                      <span
                        onClick={() => setBookmark(a?.number?.inQuran)}
                        className="cursor-pointer"
                      >
                        <i
                          className={`fa-sharp ${isMarked(
                            a?.number?.inQuran
                          )} fa-bookmark`}
                        />
                      </span>
                      <span
                        onClick={() => playAudio(i, i)}
                        className={`cursor-pointer play play${i} ${
                          isPlaying[i] ? "hidden" : ""
                        }`}
                      >
                        <i className="text-gray-500 fa-sharp fa-solid fa-play" />
                      </span>
                      <span
                        onClick={() => pauseAudio(i, i)}
                        className={`cursor-pointer pause pause${i} ${
                          isPlaying[i] ? "" : "hidden"
                        }`}
                      >
                        <i className="text-gray-500 fa-sharp fa-solid fa-pause" />
                      </span>
                      <Link to={`/surah/${detailSurat.number}/${i + 1}`}>
                        <span>
                          <i className="text-gray-500 fa-sharp fa-solid fa-book-open" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="nama-surah text-2xl mb-5 leading-[4rem]">
                      {a.text.arab}
                    </p>
                    <p className="mb-3">{a.text.transliteration.en}</p>
                    <p className="text-slate-700 mb-2">{a.translation.id}</p>
                    <audio
                      src={a.audio.primary}
                      id={`audio${i}`}
                      className="absolute opacity-0"
                      controls
                      onEnded={() => {
                        setIsPlaying((prevIsPlaying) => {
                          const newIsPlaying = [...prevIsPlaying];
                          newIsPlaying[i] = false;
                          return newIsPlaying;
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
              {renderedAyatCount < ayat.length && (
                <div className="text-center mt-4 mb-8">
                  <button
                    type="button"
                    className="bg-emerald-500 hover:bg-emerald-900 text-white font-semibold py-2 px-4 rounded-full"
                    onClick={() => setRenderedAyatCount(renderedAyatCount + 25)}
                  >
                    Muat lebih banyak ayat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Surah;
