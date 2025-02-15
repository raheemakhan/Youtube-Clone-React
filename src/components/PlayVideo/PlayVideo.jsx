import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setApiData(data.items[0]);
        }
      });
  };

  const fetchOtherData = async () => {
    if (!apiData || !apiData.snippet) return;

    // Fetch Channel Data
    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    
    await fetch(channelData_url)
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setChannelData(data.items[0]);
        }
      });

    // Fetch Comment Data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    
    await fetch(comment_url)
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setCommentData(data.items);
        }
      });
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  return (
    <div className="play-video">
      {/* YouTube Embedded Video */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      {/* Video Title */}
      <h3>{apiData ? apiData.snippet.title : "Loading Title..."}</h3>

      {/* Video Info */}
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "Loading"} Views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="Like" /> {apiData ? value_converter(apiData.statistics.likeCount) : 0}
          </span>
          <span>
            <img src={dislike} alt="Dislike" />
          </span>
          <span>
            <img src={share} alt="Share" /> Share
          </span>
          <span>
            <img src={save} alt="Save" /> Save
          </span>
        </div>
      </div>

      <hr />

      {/* Publisher Info */}
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt="Channel" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : "Loading..."}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "0"} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>

      {/* Video Description */}
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Loading Description..."}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "0"} Comments</h4>

        {/* Comments Section */}
        {commentData && commentData.length > 0 ? (
          commentData.map((item, index) => (
            <div key={index} className="comment">
              <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="User" />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="Like" />
                  <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="Dislike" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Comments Available</p>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;
