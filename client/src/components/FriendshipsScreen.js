import React from "react";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";

const FriendshipsScreen = ({ history, language }) => {
  const handleBackNav = () => {
    history.goBack();
  };
  const texts = Texts[language].myFriendshipsScreen;

  return (
    <React.Fragment>
      <BackNavigation title={texts.backNavTitle} onClick={handleBackNav} />
      {/* componente lista amicizie */}
      {/* componente navbar amicizie: lista amicizie - lista richieste - cerca persona */}
    </React.Fragment>
  );
};

export default withLanguage(FriendshipsScreen);