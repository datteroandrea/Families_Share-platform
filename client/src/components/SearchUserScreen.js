import React from "react";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"

const SearchUserScreen = ({ history, language }) => {
  const handleBackNav = () => {
    history.goBack();
  };
  const texts = Texts[language].searchUserScreen;

  return (
    <React.Fragment>
      <BackNavigation title={texts.backNavTitle} onClick={handleBackNav} />
      {/* lista amicizie */}
      <FriendshipsNavbar allowNavigation={true}/>
    </React.Fragment>
  );
};

export default withLanguage(SearchUserScreen);