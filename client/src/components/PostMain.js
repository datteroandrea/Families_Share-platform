import React from "react";
import PropTypes from "prop-types";

class PostMain extends React.Component {

  render() {
    const { body } = this.props;
    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <h1 className="dont-break-out">{body}</h1>
        </div>
      </div>
    );
  }
}

PostMain.propTypes = {
  body: PropTypes.string,
};

export default PostMain;
