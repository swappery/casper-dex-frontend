import { useMemo } from "react";
import { Currency } from "../../config/sdk/currency";
// import { isAddress } from "../../utils";

export function filterTokens(tokens: Currency[], search: string): Currency[] {
  if (search.length === 0) return tokens;

  // const searchingAddress = isAddress(search);

  if (search) {
    return tokens.filter((token) => token.address === search);
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  if (lowerSearchParts.length === 0) {
    return tokens;
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0);

    return lowerSearchParts.every(
      (p) =>
        p.length === 0 ||
        sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p))
    );
  };

  return tokens.filter((token) => {
    const { symbol, name } = token;
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name));
  });
}

export function useSortedTokensByQuery(
  tokens: Currency[] | undefined,
  searchQuery: string
): Currency[] {
  return useMemo(() => {
    if (!tokens) {
      return [];
    }

    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0);

    if (symbolMatch.length > 1) {
      return tokens;
    }

    const exactMatches: Currency[] = [];
    const symbolSubstrings: Currency[] = [];
    const rest: Currency[] = [];

    // sort tokens by exact match -> substring on symbol match -> rest
    tokens.forEach((token) => {
      if (token.symbol?.toLowerCase() === symbolMatch[0]) {
        return exactMatches.push(token);
      }
      if (
        token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())
      ) {
        return symbolSubstrings.push(token);
      }
      return rest.push(token);
    });

    return [...exactMatches, ...symbolSubstrings, ...rest];
  }, [tokens, searchQuery]);
}
