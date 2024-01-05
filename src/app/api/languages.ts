export const findLanguageName = (code: string) =>
  languages.find((lang) => lang.code === code)?.name;

export const languages = [
  { name: "English", code: "en" },

  { name: "Turkish", code: "tr" },

  { name: "Arabic", code: "ar" },

  { name: "Chinese (Simplified)", code: "zh" },

  { name: "Chinese (Traditional)", code: "zh-TW" },

  { name: "Danish", code: "da" },

  { name: "Dutch", code: "nl" },

  { name: "Finnish", code: "fi" },

  { name: "French", code: "fr" },

  { name: "German", code: "de" },

  { name: "Greek", code: "el" },

  { name: "Hindi", code: "hi" },

  { name: "Italian", code: "it" },

  { name: "Japanese", code: "ja" },

  { name: "Korean", code: "ko" },

  { name: "Norwegian", code: "no" },

  { name: "Polish", code: "pl" },

  { name: "Portuguese", code: "pt" },

  { name: "Russian", code: "ru" },

  { name: "Spanish", code: "es" },

  { name: "Swedish", code: "sv" },
];
