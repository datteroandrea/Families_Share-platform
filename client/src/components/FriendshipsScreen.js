import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";
import UserList from "./UserList";
import { text } from "body-parser";

class FriendshipsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      profileId: "",
      friends: [],
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const { profileId } = match.params;
    const friends = [];
    axios
      .get(`/api/friends/${profileId}/friendships`)
      .then(res => {
        res.data.forEach(friend => {
          friends.push(friend.user_id);
        });
        this.setState({ fetchedUsers: true, profileId: profileId, friends: friends });
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
      friends
    } = this.state;
    const texts = Texts[language].myFriendshipsScreen;
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
              <h1>{texts.backNavTitle}</h1>
            </div>
          </div>
          <div>
            <div className="row no-gutters" id="searchUserResultsContainer">
            </div>
            <UserList userIds={friends} />
            {friends.length === 0 ? <h3>{texts.noResult}</h3>: ""}
          </div>
          <FriendshipsNavbar allowNavigation={true} profileId={profileId} />
        </React.Fragment >
      )
    );
  };
}

FriendshipsScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object
};

export default withLanguage(FriendshipsScreen);