import iconSet from "quasar/icon-set/fontawesome-v5";

const fontes = ["default_font", "arial", "arial_black", "comic_sans", "courier_new", "impact", "lucida_grande", "times_new_roman", "verdana"];
const tamanhoDaFonte = ["size-1", "size-2", "size-3", "size-4", "size-5", "size-6", "size-7"];
const paragrafos = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"];

const editorTools = [
  [
    ["left"],["center"],["right"],["justify"],
  ],[
    ["bold"], ["italic"], ["strike"], ["underline"]
  ],
  [
    ["quote"], ["unordered"], ["ordered"], ["outdent"],
  ],
  [
    {
      label: "Paragrafo",
      icon: iconSet.editor.formatting,
      list: "no-icons",
      options: paragrafos
    },
    {
      label: "Font Size",
      icon: iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: "no-icons",
      options: tamanhoDaFonte
    },
    {
      label: "Font Type",
      icon: iconSet.editor.font,
      fixedIcon: true,
      list: "no-icons",
      options: fontes
    }
  ],
  ["undo", "redo", "removeFormat"]
];

const nomeDasFronts = {
  arial: "Arial",
  arial_black: "Arial Black",
  comic_sans: "Comic Sans MS",
  courier_new: "Courier New",
  impact: "Impact",
  lucida_grande: "Lucida Grande",
  times_new_roman: "Times New Roman",
  verdana: "Verdana"
};

export { nomeDasFronts, editorTools };
