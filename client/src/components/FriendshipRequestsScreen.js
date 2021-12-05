import React from "react";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"

const FriendshipRequestsScreen = ({ history, language }) => {
  const handleBackNav = () => {
    history.goBack();
  };
  const texts = Texts[language].myFriendshipsRequestsScreen;

  return (
    <React.Fragment>
      <BackNavigation title={texts.backNavTitle} onClick={handleBackNav} />
      {/* lista richieste */}
      <FriendshipsNavbar allowNavigation={true}/>
    </React.Fragment>
  );
};

export default withLanguage(FriendshipRequestsScreen);