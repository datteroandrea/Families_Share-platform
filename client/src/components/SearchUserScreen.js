import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";
import ProfilesAutoComplete from "./ProfilesAutoComplete";
import UserList from "./UserList";

class SearchUserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      profileId: "",
      searchInput: "",
      searchedForInput: false,
      searchBarIsVisible: false,
      matchingUsers: [],
      users: [],
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const { profileId } = match.params;

    axios
      .get("/api/profiles?searchBy=visibility&visible=true")
      .then(res => {
        const users = res.data;
        this.setState({ fetchedUsers: true, users, profileId: profileId });
        this.handleSearch("");
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedUsers: true });
      });
  }

  onInputChange = event => {
    this.setState({ searchInput: event.target.value, searchedForInput: false });
  };

  handleKeyPress = e => {
    const { searchInput } = this.state;
    if (e.key === "Enter") {
      this.handleSearch(searchInput);
    }
  };

  handleSearch = val => {
    const value = val.toLowerCase().trim();
    const { users } = this.state;
    const matchingUsers = [];
    users.forEach(user => {
      let userName = user.given_name.toLowerCase() + " " + user.family_name.toLowerCase();
      if (userName.includes(value)) {
        matchingUsers.push(user.user_id);
      }
    });
    this.setState({
      searchedForInput: true,
      searchInput: value,
      matchingUsers
    });
  };

  handleSearchVisibility = async () => {
    const { searchBarIsVisible } = this.state;
    await this.setState({ searchBarIsVisible: !searchBarIsVisible });
    document.getElementById("searchUserInput").focus();
  };

  render() {
    const { language, history } = this.props;
    const {
      fetchedUsers,
      profileId,
      searchBarIsVisible,
      searchInput,
      searchedForInput,
      users,
      matchingUsers
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
              <input
                type="search"
                id="searchUserInput"
                value={searchInput}
                placeholder={texts.example}
                onChange={this.onInputChange}
                onKeyPress={this.handleKeyPress}
                style={searchBarIsVisible ? {} : { display: "none" }}
              />
              <h1 style={searchBarIsVisible ? { display: "none" } : {}}>
                {texts.backNavTitle}
              </h1>
            </div>
            <div className="col-1-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handleSearchVisibility}
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
          {!searchedForInput ? (
            <div id="searchUserSuggestionsContainer">
              <ProfilesAutoComplete
                searchInput={searchInput}
                entities={users}
                handleSearch={this.handleSearch}
              />
            </div>
          ) : (
            <div>
              <div className="row no-gutters" id="searchUserResultsContainer">
              </div>
              <UserList userIds={matchingUsers} />
            </div>
          )}
          <FriendshipsNavbar allowNavigation={true} profileId={profileId} />
        </React.Fragment >
      )
    );
  };
}

SearchUserScreen.propTypes = {
    language: PropTypes.string,
    history: PropTypes.object,
    profileId: PropTypes.string
  };

export default withLanguage(SearchUserScreen);