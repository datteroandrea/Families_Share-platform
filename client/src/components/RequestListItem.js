import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Skeleton } from "antd";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
import Texts from "../Constants/Texts";
import Log from "./Log";

const getUser = userId => {
  return axios
    .get(`/api/users/${userId}/profile`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {
        image: { path: "" },
        user_id: "",
        give_name: "",
        family_name: "",
        covid_state: false
      };
    });
};

class RequestListItem extends React.Component {

  state = { fetchedUser: false, user: {}, profileId: '', showButtons: false};

  async componentDidMount() {
    const { userId } = this.props;
    const user = await getUser(userId);
    const profileId = JSON.parse(localStorage.getItem("user")).id
    this.setState({ fetchedUser: true, user: user, profileId: profileId, showButtons: true});
  }

  handleAcceptRequest = (user_id) => {
    const profileId = this.state.profileId;
    axios
      .post("/api/friends/"+user_id+"/acceptrequest")
    this.setState({showButtons: false});
  };

  handleRejectRequest = (user_id) => {
    const profileId = this.state.profileId;
    axios
      .post("/api/friends/"+user_id+"/declinerequest")
    this.setState({showButtons: false});
  };

  render() {
    const { language } = this.props;
    const texts = Texts[language].requestListItem;
    const { user, fetchedUser } = this.state;
    const covid_alert = user.covid_state;
    const showButtons = this.state.showButtons;
    return fetchedUser ? (
      <div
        role="button"
        tabIndex={-42}
        className="row no-gutters"
        id="suggestionContainer"
      >
        <div className="col-2-10">
          <Avatar
            thumbnail={user.image.thumbnail_path}
            className="center"
            route={`/profiles/${user.user_id}/info`}
          />
        </div>
        <div className="col-8-10">
          <div id="">
            <h1>{user.given_name+" "+user.family_name} {covid_alert ? "🔴" : "  "}</h1>
            { showButtons ?
              <button
                onClick={() => this.handleAcceptRequest(user.user_id)}
                type="button"
                className="acceptButton"
              >
                {texts.accept}
              </button>
            : <div/> }
                
            { showButtons ?
              <button
                onClick={() => this.handleRejectRequest(user.user_id)}
                type="button"
                className="refuseButton"
              >
                {texts.refuse}
              </button>
            : <div/> }
          </div>
        </div>
      </div>
    ) : (
      <div className="row no-gutters" id="suggestionContainer">
        <Skeleton avatar active paragraph={{ rows: 2 }} />
      </div>
    );
  }
}

RequestListItem.propTypes = {
  groupId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(withLanguage(RequestListItem));
