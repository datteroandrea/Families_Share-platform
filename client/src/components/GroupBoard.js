import React from "react";
import PropTypes from "prop-types";
import BackNavigation from "./BackNavigation";

const GroupBoard = props => {
  const { history, userIsAdmin, group } = props;
  const handleGoBack = () => {
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };
  return (
    <React.Fragment>
      <BackNavigation title={group.name} fixed onClick={() => handleGoBack()} />
    </React.Fragment>
  );
};

export default GroupBoard;

GroupBoard.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};