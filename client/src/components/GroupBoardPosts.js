import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LazyLoad from "react-lazyload";
import PostHeader from "./PostHeader";
import PostMain from "./PostMain";
import PostReplies from "./PostReplies";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";
import Texts from "../Constants/Texts";

class GroupBoardPosts extends React.Component {
  state = { fetchedPosts: false, tag: "all" };

  componentDidMount() {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/noticeboard/posts`)
      .then(response => {
        const posts = response.data;
        this.setState({
          fetchedPosts: true,
          posts
        });
      })
      .catch(error => {
        Log.error(error);
        this.setState({ fetchedPosts: true, posts: [] });
      });

      this.handleTagChange = this.handleTagChange.bind(this);
  }

  handleTagChange(event) {
    this.setState({ tag: event.target.value});
  }

  refresh = () => {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/noticeboard/posts`)
      .then(async response => {
        const posts = response.data;
        await this.setState({
          posts
        });
        await this.postsStart.scrollIntoView({ behavior: "smooth" });
      })
      .catch(error => {
        Log.error(error);
      });
  };

  renderPosts = () => {
    const { posts, tag } = this.state;
    const selectedPosts = (tag === "all") ? posts : posts.filter(post => post.tag === tag);
    const { userIsAdmin, groupId, history } = this.props;
    const { length } = selectedPosts;
    const blocks = [...Array(Math.ceil(length / 2)).keys()];
    
    return (
      <ul>
        {blocks.map(block => {
          let indexes;
          if (length <= 2) {
            indexes = [...Array(length).keys()];
          } else {
            indexes = [
              ...Array(
                (block + 1) * 2 <= length ? 2 : length - block * 2
              ).keys()
            ].map(x => block * 2 + x);
          }
          return (
            <LazyLoad height={450} once offset={100}>
              {indexes.map(index => (
                <li
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                  key={index}
                  ref={ref => {
                    if (index === 0) {
                      this.postsStart = ref;
                    }
                  }}
                > 
                  <div id="announcementContainer" 
                       className={(selectedPosts[index].owner === JSON.parse(localStorage.getItem("user")).id) ? "horizontalCenter shadow-sm " : "horizontalCenter bg-light shadow-sm"}
                       style={(selectedPosts[index].owner === JSON.parse(localStorage.getItem("user")).id) ? {backgroundColor: "#afdddd"} : {}}
                  >
                    <PostHeader
                      ownerId={selectedPosts[index].owner}
                      createdAt={selectedPosts[index].createdAt}
                      userIsAdmin={userIsAdmin}
                      handleRefresh={this.refresh}
                      postId={selectedPosts[index].post_id}
                      groupId={groupId}
                      history={history}
                    />
                    <PostMain
                      body={selectedPosts[index].text}
                      title={selectedPosts[index].title}
                      tag={selectedPosts[index].tag}
                    />
                    <PostReplies
                      postId={selectedPosts[index].post_id}
                      groupId={groupId}
                      userIsAdmin={userIsAdmin}
                    />
                  </div>
                </li>
              ))}
            </LazyLoad>
          );
        })}
      </ul>
    );
  };

  render() {
    const { fetchedPosts } = this.state;
    const { language } = this.props;
    const tags = Texts[language].postTag;
    
    return (
      <div id="postsContainer">
        <select
            className="createPostTypeSelect form-control"
            onChange={this.handleTagChange}
        >
            {Object.keys(tags).map((key) => (
              <option value={key}>{tags[key]}</option>
            ))}
            <option value= "all" selected="selected">All</option>
        </select>
        {fetchedPosts ? this.renderPosts() : <LoadingSpinner />}
      </div>
    );
  }
}
export default GroupBoardPosts;

GroupBoardPosts.propTypes = {
  groupId: PropTypes.string,
  userIsAdmin: PropTypes.bool
};
