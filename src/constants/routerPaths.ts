export const links = {
  home: "",
  useContext: "useContext",
  useRef: "useRef",
};

export const paths = Object.fromEntries(
  Object.entries(links).map(([key, value]) => [key, "/" + value])
);
