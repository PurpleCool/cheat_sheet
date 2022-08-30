export const links = {
  home: "",
  useContext: "useContext",
};

export const paths = Object.fromEntries(
  Object.entries(links).map(([key, value]) => [key, "/" + value])
);
