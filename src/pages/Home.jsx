import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Main from "../layout/Main";
import BreadCrumbs from "../components/BreadCrumbs";
import SearchBar from "../components/SearchBar";
import MyAd from "../components/MyAd";

const Home = () => {
  const [surah, setSurah] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState(() => {
    // Retrieve sorting order from local storage or use default value
    return localStorage.getItem("sortOrder") || "desc";
  });

  const getSurah = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api.quran.gading.dev/surah");
      setSurah(res.data.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleSortChange = () => {
    // Toggle sorting order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    // Save sorting order to local storage
    localStorage.setItem("sortOrder", newSortOrder);
  };

  useEffect(() => {
    getSurah();
  }, []);

  return (
    <Main>
      <div className="md:w-5/12 md:mx-auto bg-white min-h-screen">
        <nav className="py-6 px-7">
          <div className="flex justify-between text-gray-500">
            <BreadCrumbs loading={loading} />
            <div>
              <span id="clock" className="text-sm" />
            </div>
          </div>
        </nav>
        <div className="px-5 pt-2">
          <div>
            <p className="text-3xl font-semibold mt-2">Al-Quran Indonesia</p>
          </div>
          <div className="mt-4">
            <SearchBar
              placeholder="Cari Surah"
              onChangeSearch={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <div className="ChapterAndJuzList_sorter__EiaST mt-2">
              <div
                className="flex items-center"
                role="button"
                tabIndex={0}
                onClick={handleSortChange}
              >
                <span className="text-sm">
                  {" "}
                  Sorting Dengan :{sortOrder === "asc" ? " Menaik" : " Menurun"}
                </span>
                <span className="">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    shapeRendering="geometricPrecision"
                    style={{ color: "currentcolor" }}
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="mt-8 grid place-items-center">
              <div className="lds-ripple">
                <div />
                <div />
              </div>
            </div>
          ) : (
            <div className="mt-8">
              {surah
                .filter((_surah) =>
                  search.toLowerCase() === ""
                    ? _surah
                    : _surah.name.transliteration.id
                        .toLowerCase()
                        .includes(search)
                )
                .sort((a, b) =>
                  sortOrder === "asc"
                    ? a.number - b.number
                    : b.number - a.number
                )
                .map((_surah) => (
                  <Link to={`/surah/${_surah.number}`} key={_surah?.number}>
                    <div className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 radius flex justify-center items-center border border-emerald-500">
                          <span className="text-slate-500 text-sm">
                            {_surah.number}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {_surah.name.transliteration.id}
                          </p>
                          <p className="text-sm text-slate-500">
                            {_surah.name.translation.id}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-2xl nama-surah">
                          {_surah.name.short}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default React.memo(Home);
