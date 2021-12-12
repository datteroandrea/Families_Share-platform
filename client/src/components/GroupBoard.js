import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Fab from "@material-ui/core/Fab";


const styles = {
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem"
  }
};


class GroupBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { group } = this.props;

    return (
      <div
        className="row no-gutters"
        style={{
          bottom: "8rem",
          right: "7%",
          zIndex: 100,
          position: "fixed"
        }}
      >
        <Fab
          color="primary"
          style={styles.add}            
        >
          <i className="fas fa-plus" />
        </Fab>
      </div>
    );
  }
}


GroupBoard.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};

export default withLanguage(GroupBoard);