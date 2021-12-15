import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import BackNavigation from "./BackNavigation";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import Log from "./Log";
import Texts from "../Constants/Texts";

const getGroup = groupId => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {};
    });
};

const getPost = (groupId, postId) => {
  return axios
    .get(`/api/groups/${groupId}/noticeboard/posts/${postId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      Log.error(error);
      return {};
    });
}

class EditPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      fetchedPost: false,
      title: '',
      content: '',
      post: {}
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
  }

  handleGoBack() {
    const { history } = this.props;
    if (history.length === 1) {
      history.replace("/myfamiliesshare");
    } else {
      history.goBack();
    }
  };

  handleTitleChange(event) {
    const { post } = this.state;
    post.title = event.target.value;
    this.setState({ post: post });
  }

  handleContentChange(event) {
    const { post } = this.state;
    post.text = event.target.value;
    this.setState({ post: post });
  }

  handleUpdatePost() {
    const { group_id } = this.state.group;
    const { post } = this.state;
    axios.post(
      "/api/groups/" + group_id + "/noticeboard/posts/" + post.post_id + "/edit", { post: post }).then(() => {
        this.handleGoBack();
      });
  }

  async componentDidMount() {
    const { match } = this.props;
    const { groupId, postId } = match.params;
    const group = await getGroup(groupId);
    const post = await getPost(groupId, postId);
    console.log(post);
    this.setState({ group: group, fetchedPost: true, post: post })
  }

  render() {
    const { fetchedPost, group, post } = this.state;
    return fetchedPost ? (
      <React.Fragment>
        <BackNavigation title={group.name} fixed onClick={() => this.handleGoBack()} />
        <form className="row no-gutters post">
          <input
            type="text"
            name="name"
            className="createPostTitleInput form-control"
            value={post.title}
            onChange={this.handleTitleChange}
            required
          />
          <textarea
            rows="1"
            name="description"
            className="createPostDescriptionInput form-control"
            value={post.text}
            onChange={this.handleContentChange}
            required
          />
          <button
            onClick={this.handleUpdatePost}
            type="button"
            className="findOutMore createButton"
          >
            Update Post
          </button>
        </form>

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