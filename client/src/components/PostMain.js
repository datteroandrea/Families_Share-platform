import React from "react";
import PropTypes from "prop-types";

class PostMain extends React.Component {

  render() {
    const { body, title } = this.props;
    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <h1 className="dont-break-out">{title}</h1>
        </div>
        <div className="row no-gutters">
          <p>{body}</p>
        </div>
      </div>
    );
  }
}

PostMain.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string
};

export default PostMain;
