import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import Images from "../Constants/Images";

const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiBottomNavigation: {
      root: {
        position: "fixed",
        bottom: 0,
        height: "5.6rem",
        backgroundColor: "#00838F",
        width: "100%",
        zIndex: 100
      }
    },
    MuiBottomNavigationAction: {
      root: {
        minWidth: 0,
        maxWidth: 100000
      },
      label: {
        color: "white",
        fontSize: "1.2rem",
        "&$selected": {
          fontSize: "1.2rem"
        }
      }
    },
    MuiButtonBase: {
      disabled: {
        opacity: 0.1
      }
    }
  }
});

const FriendshipsNavbar = ({ history, language, allowNavigation, profileId }) => {
  const handleChange = (event, value) => {
    if (allowNavigation) {
      if (value === "friendships") {
        history.replace("/"+profileId+"/friendships");
      } else if (value === "requests") {
        history.replace("/"+profileId+"/requests");
      } else {
        history.replace("/"+profileId+"/search");
      }
    }
  };
  const texts = Texts[language].friendshipsNavbar;

  const { pathname } = history.location;
  let activeTab = pathname.slice(
    pathname.lastIndexOf("/") + 1
  );
  const flags = [
    activeTab === "friendships",
    activeTab === "requests",
    activeTab === "search"
  ];
  return (
    // Aggiungere rotte per ogni tab
    <MuiThemeProvider theme={muiTheme}>
      <BottomNavigation value={activeTab} onChange={handleChange} showLabels>
        <BottomNavigationAction
          value="friendships"
          label={texts.friendshipsTab}
          icon={
            flags[0] ? (
              <i className="fas fa-user-friends groupNavbarIcon" />
            ) : (
              <img
                alt=""
                src={Images.userFriendsRegular}
                className="userFriendsRegular"
              />
            )
          }
        />
        <BottomNavigationAction
          value="requests"
          label={texts.requestsTab}
          icon={
            flags[1] ? (
              <i className="fas fa-clipboard groupNavbarIcon" />
            ) : (
              <i className="far fa-clipboard groupNavbarIcon" />
            )
          }
        />
        <BottomNavigationAction
          value="search"
          label={texts.searchTab}
          icon={
            flags[2] ? (
              <i className="fas fa-user groupNavbarIcon" />
            ) : (
              <i className="far fa-user groupNavbarIcon" />
            )
          }
        />
      </BottomNavigation>
    </MuiThemeProvider>
  );
};

FriendshipsNavbar.propTypes = {
  allowNavigation: PropTypes.bool,
  history: PropTypes.object,
  language: PropTypes.string
};

export default withRouter(withLanguage(FriendshipsNavbar));
