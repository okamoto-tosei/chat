import React, { useState, useEffect } from 'react';
import Post from './Post';
import { db } from '../firebase';
import { TweetInput } from './TweetInput';
import styles from './Feed.module.css';

type PostData = {
  id: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
};

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostData>([
    {
      id: '',
      avatar: '',
      image: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);

  // 投稿データの取得
  useEffect(() => {
    const unSub = db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        );
      });
    return () => {
      unSub();
    };
  }, []);

  console.log(posts);
  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts[0].id && (
        <>
          {posts.map((value) => (
            <Post
              key={value.id}
              postId={value.id}
              avatar={value.avatar}
              image={value.image}
              text={value.text}
              timestamp={value.timestamp}
              username={value.username}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
