import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import withLanguage from "./LanguageContext";
import PostReply from "./PostReply";
import Texts from "../Constants/Texts";
import Log from "./Log";

class PostReplies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newReply: "",
      showReplies: false,
      fetchedReplies: false
    };
  }

  componentDidMount() {
    const { groupId } = this.props;
    const { postId } = this.props;
    axios
      .get(`/api/groups/${groupId}/noticeboard/posts/${postId}/replies`)
      .then(response => {
        const replies = response.data;
        this.setState({ fetchedReplies: true, replies });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedReplies: true, replies: [] });
      });
  }

  componentWillReceiveProps(props) {
    const { groupId } = this.props;
    const { postId } = this.props;
    if (groupId !== props.groupId || postId !== props.postId) {
      this.setState({ fetchedReplies: false });
      axios
      .get(`/api/groups/${props.groupId}/noticeboard/posts/${props.postId}/replies`)
        .then(response => {
          const replies = response.data;
          this.setState({ fetchedReplies: true, replies });
        })
        .catch(error => {
          Log.error(error);
        this.setState({ fetchedReplies: true, replies: [] });
        });
    }
  }

  refresh = () => {
    const { groupId } = this.props;
    const { postId } = this.props;
    axios
      .get(`/api/groups/${groupId}/noticeboard/posts/${postId}/replies`)
      .then(response => {
        const replies = response.data;
        this.setState({ replies });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  handleSend = () => {
    const { groupId, postId } = this.props;
    const { newReply } = this.state;
    axios
      .post(`/api/groups/${groupId}/noticeboard/posts/${postId}/replies`, {
        user_id: JSON.parse(localStorage.getItem("user")).id,
        message: newReply
      })
      .then(response => {
        Log.info(response);
        this.refresh();
      })
      .catch(error => {
        Log.error(error);
      });
    this.setState({ newReply: "" });
  };

  handleChange = event => {
    this.setState({ newReply: event.target.value });
  };

  handleShow = () => {
    const { showReplies } = this.state;
    this.setState({ showReplies: !showReplies });
  };

  renderReplies = () => {
    const { replies } = this.state;
    const { groupId, userIsAdmin } = this.props;
    return (
      <ul>
        {replies.map((reply, index) => (
          <li key={index}>
            <PostReply
              reply={reply}
              handleRefresh={this.refresh}
              groupId={groupId}
              userIsAdmin={userIsAdmin}
            />
          </li>
        ))}
      </ul>
    );
  };

  handleEnter = event => {
    if (event.keyCode === 13) this.handleSend();
  };

  render() {
    const { language } = this.props;
    const { showReplies, fetchedReplies, newReply } = this.state;
    const texts = Texts[language].postReplies;
    const showRepliesIcon = showReplies
      ? "fas fa-chevron-up"
      : "fas fa-chevron-down";
    return (
      <React.Fragment>
        <div id="showRepliesContainer">
          <button
            type="button"
            className="transparentButton"
            onClick={this.handleShow}
          >
            <i className={showRepliesIcon} />
          </button>
        </div>
        <div
          id="announcementRepliesContainer"
          style={showReplies ? {} : { display: "none" }}
        >
          {fetchedReplies ? this.renderReplies() : <div />}
          <div className="row no-gutters" id="newReplyContainer">
            <div className="col-8-10">
              <input
                type="text"
                placeholder={texts.new}
                value={newReply}
                onChange={this.handleChange}
                className="verticalCenter"
                style={{background: "transparent"}}
                onKeyUp={this.handleEnter}
              />
            </div>
            <div className="col-2-10">
              <button
                className="transparentButton center"
                onClick={this.handleSend}
                type="button"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

PostReplies.propTypes = {
  announcementId: PropTypes.string,
  groupId: PropTypes.string,
  userIsAdmin: PropTypes.bool,
  language: PropTypes.string
};

export default withLanguage(PostReplies);
