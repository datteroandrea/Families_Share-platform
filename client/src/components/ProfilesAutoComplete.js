import React from "react";
import PropTypes from "prop-types";
import Highlighter from "./Highlighter";

class ProfilesAutoComplete extends React.Component {
  handleClick = id => {
    const { handleSearch } = this.props;
    handleSearch(id);
  };

  getSuggestions = value => {
    const { entities } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestions =
      inputLength === 0
        ? []
        : entities.filter(entity =>
            (entity.given_name.toLowerCase() + " " + entity.family_name.toLowerCase()).includes(inputValue.toLowerCase().trim())
          );
    return suggestions;
  };

  renderSuggestions = () => {
    const { searchInput } = this.props;
    return (
      <ul>
        {this.getSuggestions(searchInput).map((suggestion, index) => (
          <li key={index}>
            <div
              role="button"
              tabIndex={-42}
              className="row no-gutters"
              style={{ cursor: "pointer", margin: "0.7rem 0" }}
              onClick={() => this.handleClick(suggestion.given_name + " " + suggestion.family_name)}
            >
              <div className="col-2-10">
                <i className="fas fa-search" />
              </div>
              <div className="col-8-10">
                <div className="autoCompleteText">
                  <Highlighter text={suggestion.given_name + " " + suggestion.family_name} highlight={searchInput} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    return this.renderSuggestions();
  }
}

export default ProfilesAutoComplete;

ProfilesAutoComplete.propTypes = {
  entities: PropTypes.array,
  searchInput: PropTypes.string,
  handleSearch: PropTypes.func
};
