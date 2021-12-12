import React from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";
import withLanguage from "./LanguageContext";


class GroupBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { group } = this.props;

    return (
      <React.Fragment>

      </React.Fragment>
    );
  }
}


GroupBoard.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};

export default withLanguage(GroupBoard);