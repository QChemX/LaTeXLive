import { useQuery } from "@tanstack/react-query";
import { fetchAutocomplete, fetchEditorCatalog } from "@/features/editor/lib/editor-data";

export function useEditorCatalog() {
  return useQuery({
    queryKey: ["editor-catalog"],
    queryFn: fetchEditorCatalog,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useAutocomplete(enabled: boolean) {
  return useQuery({
    queryKey: ["editor-autocomplete"],
    queryFn: fetchAutocomplete,
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  });
}
