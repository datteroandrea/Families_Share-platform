import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";
import UserList from "./UserList";
import { text } from "body-parser";

class FriendshipRequestsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      profileId: "",
      searchBarIsVisible: false,
      requests: []
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const { profileId } = match.params;
    const requests = [];
    axios
      .get(`/api/friends/${profileId}/requests`)
      .then(res => {
        res.data.forEach(request => {
          requests.push(request);
        });
        this.setState({ fetchedUsers: true, profileId: profileId, requests: requests });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedUsers: true });
      });
  }

  render() {
    const { language, history } = this.props;
    const {
      fetchedUsers,
      profileId,
      searchBarIsVisible,
      requests
    } = this.state;
    const texts = Texts[language].friendshipRequestScreen;
    return (
      fetchedUsers && (
        <React.Fragment>
          <div className="row no-gutters" id="searchUserBarContainer">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.replace("/myfamiliesshare")}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div
              className="col-7-10 "
              style={{ display: "flex", alignItems: "center" }}
            >
              <h1 style={searchBarIsVisible ? { display: "none" } : {}}>
                {texts.backNavTitle}
              </h1>
            </div>
          </div>
          <div>
            <div className="row no-gutters" id="searchUserResultsContainer">
              <h1></h1>
            </div>
            <UserList userIds={requests} />
            {requests.length == 0 ? <h3>{texts.noResults}</h3>: ""}
          </div>
          <FriendshipsNavbar allowNavigation={true} profileId={profileId} />
        </React.Fragment >
      )
    );
  };
}

FriendshipRequestsScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(FriendshipRequestsScreen);