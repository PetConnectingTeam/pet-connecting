import React from "react";
import { useTranslations } from "next-intl";

function App() {
  const t = useTranslations("HomePage");
  return (
    <div className="App">
      <h1>{t("title")}</h1>
    </div>
  );
}

export default App;
