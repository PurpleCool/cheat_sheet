export const links = {
  home: "",
  useContext: "useContext,",
};


export const paths = (() => {
  return Object.fromEntries(Object.entries(links).map(([key, value]) => [key, '/' + value]));
})();
