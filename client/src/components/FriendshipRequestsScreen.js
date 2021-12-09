import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";
import ProfilesAutoComplete from "./ProfilesAutoComplete";
import UserList from "./UserList";

class FriendshipRequestsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      profileId: "",
      searchInput: "",
      searchedForInput: false,
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
        console.log(res.data);
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
      searchInput,
      searchedForInput,
      requests
    } = this.state;
    const texts = Texts[language].searchUserScreen;
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
            </div>
          </div>
          <div>
            <div className="row no-gutters" id="searchUserResultsContainer">
              <h1></h1>
            </div>
            <UserList userIds={requests} />
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