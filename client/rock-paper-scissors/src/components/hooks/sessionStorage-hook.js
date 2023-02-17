import { useState } from "react";

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const jsonValue = sessionStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  // useEffect(() => {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }, [key, value]);

  return [value, setValue];
}
