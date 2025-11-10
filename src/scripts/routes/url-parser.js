const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splittedUrl = this._urlSplitter(url);
    return this._urlCombiner(splittedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1);
    const splittedUrl = this._urlSplitter(url);

    return {
      resource: splittedUrl[0] || null,
      id: splittedUrl[1] || null,
    };
  },

  _urlSplitter(url) {
    const parts = url.split("/");
    return parts.filter((part) => part !== "");
  },

  _urlCombiner(splittedUrl) {
    if (splittedUrl.length === 0) return "/";
    return `/${splittedUrl[0]}${splittedUrl.length > 1 ? "/:id" : ""}`;
  },
};

export default UrlParser;
