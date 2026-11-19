import { use } from "react";
import { SuggestContext } from "../context/SuggestContext";

export function useSuggest() {
  const context = use(SuggestContext);
  if (!context) throw new Error("useSuggest deve essere usato all'interno di SuggestProvider");
  return context;
}
