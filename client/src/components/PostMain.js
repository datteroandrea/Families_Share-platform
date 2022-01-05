import React from "react";
import PropTypes from "prop-types";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";

class PostMain extends React.Component {

  render() {
    const tag_colors = {
      game:   "tag1",
      school: "tag2",
      music:  "tag3",
      sport:  "tag4",
      buy:    "tag5",
      sell:   "tag6",
      other:  "tag7"
    }

    const { language } = this.props;
    const { body, title, tag } = this.props;
    const tagName = Texts[language].postTag[tag];
    const tag_col = tag_colors[tag];

    return (
      <div id="announcementMainContainer" className="horizontalCenter">
        <div className="row no-gutters">
          <h1 className="dont-break-out">{title} </h1>
          <button
            className={tag_col}
          >
            {tagName}
          </button>
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