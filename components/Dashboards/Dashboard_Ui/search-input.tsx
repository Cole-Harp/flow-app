"use client";

import qs from "query-string";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "../../../lib/hooks/use-debounce";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const folderId = searchParams.get("folderId");
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");
  const debouncedValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debouncedValue,
      folderId: folderId,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, router, folderId]);

  useEffect(() => {
    const searchIcon = document.querySelector(".search-icon");
    const input = document.querySelector(".search-input");

    const handleSearchClick = () => {
      input.classList.toggle("hidden");
    };

    searchIcon.addEventListener("click", handleSearchClick);

    return () => {
      searchIcon.removeEventListener("click", handleSearchClick);
    };
  }, []);

  return (
    <div className="relative pt-4">
      <Search className="absolute h-16 w-4 top-1 left-3 right-0 text-muted-foreground search-icon" />
      <Input
        onChange={onChange}
        value={value}
        placeholder="Search..."
        className="pl-10 bg-primary/10 search-input"
      />
    </div>
  );
};