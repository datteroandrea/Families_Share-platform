import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import LazyLoad from "react-lazyload";
import AnnouncementBar from "./AnnouncementBar";
import AnnouncementHeader from "./AnnouncementHeader";
import AnnouncementMain from "./AnnouncementMain";
import AnnouncementReplies from "./AnnouncementReplies";
import LoadingSpinner from "./LoadingSpinner";
import Log from "./Log";

class GroupBoardPosts extends React.Component {
  state = { fetchedPosts: false };

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
  }

  refresh = () => {
    const { groupId } = this.props;
    axios
      .get(`/api/groups/${groupId}/posts`)
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
    const { posts } = this.state;
    const { userIsAdmin } = this.props;
    const { length } = posts;
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
                  style={{ padding: "2rem 0" }}
                  key={index}
                  ref={ref => {
                    if (index === 0) {
                      this.postsStart = ref;
                    }
                  }}
                >
                  <div id="announcementContainer" className="horizontalCenter">
                    <AnnouncementHeader
                      userId={posts[index].user_id}
                      createdAt={posts[index].createdAt}
                      userIsAdmin={userIsAdmin}
                      handleRefresh={this.refresh}
                      announcementId={posts[index].announcement_id}
                      groupId={posts[index].group_id}
                    />
                    <AnnouncementMain
                      message={posts[index].body}
                      images={posts[index].images}
                    />
                    <AnnouncementReplies
                      announcementId={posts[index].announcement_id}
                      groupId={posts[index].group_id}
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
    const { fetchedposts } = this.state;
    const { groupId } = this.props;
    return (
      <div id="postsContainer">
        {fetchedposts ? this.renderPosts() : <LoadingSpinner />}
        <AnnouncementBar groupId={groupId} handleRefresh={this.refresh} />
      </div>
    );
  }
}
export default GroupBoardPosts;

GroupBoardPosts.propTypes = {
  groupId: PropTypes.string,
  userIsAdmin: PropTypes.bool
};
