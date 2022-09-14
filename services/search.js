import { pqrequest } from "./request/index";

export function getHotSearch() {
  return pqrequest.get({
    url: "/search/hot",
  });
}

export function getSuggestSearch(value) {
  return pqrequest.get({
    url: "/search/suggest",
    data: {
      keywords: value,
    },
  });
}

export function getSearchResult(value) {
  return pqrequest.get({
    url: "/search",
    data: {
      keywords: value,
    },
  });
}
