import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";


class PostMain extends React.Component {

  render() {
    const { language } = this.props;
    const { body, title, tag } = this.props;
    const tagName = Texts[language].postTag[tag];
    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <h1 className="dont-break-out">{title} ({tagName})</h1>
        </div>
        <div className="row no-gutters">
          <p>{body}</p>
        </div>
      </div>
    );
  }
}

PostMain.propTypes = {
  language: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  tag: PropTypes.string,
};

export default withLanguage (PostMain);