"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Globe } from "lucide-react";

export default function SearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("모든 종류");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (destination) {
      router.push(
        `/packages?destination=${encodeURIComponent(
          destination
        )}&type=${encodeURIComponent(tripType)}`
      );
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white p-8 rounded-2xl shadow-soft-2xl max-w-4xl mx-auto border border-neutral-100 animate-scale-in"
    >
      <h2 className="text-xl font-bold text-center mb-6 text-neutral-800">
        어디로 떠나고 싶으신가요?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label
            htmlFor="destination"
            className="block text-sm font-bold text-neutral-800 mb-2"
          >
            여행지
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
            <input
              type="text"
              id="destination"
              className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-neutral-300 rounded-lg p-3.5 transition text-neutral-800 font-medium placeholder-neutral-500 hover:border-blue-300"
              placeholder="도시나 국가를 입력하세요"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-4">
          <label
            htmlFor="trip-type"
            className="block text-sm font-bold text-neutral-800 mb-2"
          >
            여행 종류
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
            <select
              id="trip-type"
              className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-neutral-300 rounded-lg p-3.5 transition text-neutral-800 font-medium cursor-pointer hover:border-blue-300"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="모든 종류">모든 종류</option>
              <option value="휴양">휴양</option>
              <option value="관광">관광</option>
              <option value="어드벤처">어드벤처</option>
              <option value="커플">커플</option>
            </select>
          </div>
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="bg-gradient-blue text-white px-6 py-3.5 rounded-lg font-bold hover:opacity-90 transition-all duration-300 w-full flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <Search className="h-5 w-5 mr-2 text-white" />
            검색
          </button>
        </div>
      </div>
    </form>
  );
}
