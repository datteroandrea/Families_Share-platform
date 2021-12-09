import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Skeleton } from "antd";
import axios from "axios";
import withLanguage from "./LanguageContext";
import Avatar from "./Avatar";
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

class UserListItem extends React.Component {
  state = { fetchedUser: false, user: {} };

  async componentDidMount() {
    const { userId } = this.props;
    const user = await getUser(userId);
    this.setState({ fetchedUser: true, user });
  }

  handleNavigation = () => {
    const { history } = this.props;
    const { user } = this.state;
    history.push(`/profiles/${user.user_id}/info`);
  };

  render() {
    const { language } = this.props;
    const { user, fetchedUser } = this.state;
    console.log(user.user_id);
    const covid_alert = user.covid_state;
    return fetchedUser ? (
      <div
        role="button"
        tabIndex={-42}
        className="row no-gutters"
        id="suggestionContainer"
        onClick={this.handleNavigation}
      >
        <div className="col-2-10">
          <Avatar
            thumbnail={user.image.thumbnail_path}
            className="center"
            route={`/profiles/${user.user_id}/info`}
          />
        </div>
        <div className="col-8-10">
          <div id="suggestionInfoContainer">
            <h1>{user.given_name+" "+user.family_name} {covid_alert ? "🔴" : "  "}</h1>
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

UserListItem.propTypes = {
  groupId: PropTypes.string,
  language: PropTypes.string,
  history: PropTypes.object
};

export default withRouter(withLanguage(UserListItem));
