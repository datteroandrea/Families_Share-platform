import React from "react";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"

const FriendshipsScreen = ({ history, language }) => {
  const handleBackNav = () => {
    history.goBack();
  };
  const texts = Texts[language].myFriendshipsScreen;

  return (
    <React.Fragment>
      <BackNavigation title={texts.backNavTitle} onClick={handleBackNav} />
      {/* componente lista amicizie */}
      <FriendshipsNavbar allowNavigation={true}/>
    </React.Fragment>
  );
};

export default withLanguage(FriendshipsScreen);