import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";

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
    },
    post: {
        width: "70%",
        margin: "auto",
    },
};

class EditPost extends React.Component {
  constructor(props) {
    this.state = {
    };
  }

  handleGoBack() {
    const { history } = this.props;
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };

  handleUpdatePost() {
    
  }

  render() {
    const { fetchedGroup } = this.state;
    const { group } = this.state;
    return fetchedGroup ? (
        <React.Fragment>
            <BackNavigation title={group.name} fixed onClick={() => this.handleGoBack()} />
            <div class="row no-gutters" style={styles.post}>
                <input
                    style={styles.title}
                    type="text"
                    name="name"
                    className="createPostTitleInput form-control"
                    required
                />
                <textarea
                    style={styles.textarea}
                    rows="1"
                    name="description"
                    className="createPostDescriptionInput form-control"
                    required
                />
                <button
                    onClick={this.handleUpdatePost}
                    type="button"
                    className="findOutMore createButton"
                >
                    Update Post
                </button>
            </div>

        </React.Fragment>
    ) : (
        <LoadingSpinner />
    );
}
}


EditPost.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  history: PropTypes.object
};

export default withLanguage(EditPost);