import React from "react";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import FriendshipsNavbar from "./FriendshipsNavbar"
import Log from "./Log";

class SearchUserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      searchBarIsVisible: false
    };
  }
  componentDidMount() {
    
  }

  handleSearchVisibility = async () => {
    const { searchBarIsVisible } = this.state;
    await this.setState({ searchBarIsVisible: !searchBarIsVisible });
    document.getElementById("searchGroupInput").focus();
  };

  render() {
    const { language, history } = this.props;
    const {
      searchBarIsVisible,
      searchInput,
    } = this.state;
    const texts = Texts[language].searchUserScreen;
    return (
      <React.Fragment>
        {/* lista amicizie */}
        <div className="row no-gutters" id="searchGroupBarContainer">
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
              id="searchGroupInput"
              value={searchInput}
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
        <FriendshipsNavbar allowNavigation={true} />
      </React.Fragment >
    );
  };
}

SearchUserScreen.propTypes = {
    language: PropTypes.string,
    history: PropTypes.object
  };

export default withLanguage(SearchUserScreen);