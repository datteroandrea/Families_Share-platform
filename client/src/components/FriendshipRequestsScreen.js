import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";
import RequestList from "./RequestList";

class FriendshipRequestsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      profileId: "",
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
              <h1>
                {texts.backNavTitle}
              </h1>
            </div>
          </div>
          <div>
            <div className="row no-gutters" id="searchUserResultsContainer">
              
            </div>
            <RequestList userIds={requests}/>
            {requests.length === 0 ? <h2 className="text-center align-center mt-5">{texts.noResults}</h2> : ""}
          </div>
          <FriendshipsNavbar allowNavigation={true} profileId={profileId}/>
        </React.Fragment >
      )
    );
  };
}

FriendshipRequestsScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
  profileId: PropTypes.string
};

export default withLanguage(FriendshipRequestsScreen);