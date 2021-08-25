import React, { useState, useEffect } from 'react';
import style from './Post.module.css';

// *firebase
import firebase from 'firebase/app';
import { db } from '../firebase';

// *redux
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

// *material
import { Avatar } from '@material-ui/core';
import { makeStyles, StylesProvider } from '@material-ui/core/styles';
import MessageIcon from '@material-ui/icons/Message';
import SendIcon from '@material-ui/icons/Send';

type PropsType = {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
};

type CommentType = {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
};

const useStyles = makeStyles((theme) => {
  return {
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
  };
});

const Post: React.FC<PropsType> = (props) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentType>([
    {
      id: '',
      avatar: '',
      text: '',
      timestamp: null,
      username: '',
    },
  ]);

  const [openComments, setOpenComments] = useState(false);

  useEffect(() => {
    const unSub = db
      .collection('posts')
      .doc(props.postId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((value) => {
            return {
              id: value.id,
              avatar: value.data().avatar,
              text: value.data().text,
              username: value.data().username,
              timestamp: value.data().timestamp,
            };
          })
        );
      });
    return () => {
      unSub();
    };
  }, [props.postId]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection('posts').doc(props.postId).collection('comments').add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment('');
  };
  return (
    <div className={style.post}>
      <div className={style.post_avatar}>
        <Avatar src={props.avatar} />
      </div>
      <div className={style.post_body}>
        <div>
          <div className={style.post_header}>
            <h3>
              <span className={style.post_headerUser}>@{props.username}</span>
              <span className={style.post_headerTime}>
                {new Date(props?.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={style.post_tweet}>
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className={style.post_tweetImage}>
            <img src={props.image} alt="tweet" />
          </div>
        )}

        <MessageIcon
          className={style.post_commentIcon}
          onClick={() => setOpenComments(!openComments)}
        />
        {openComments && (
          <>
            {comments.map((value) => {
              return (
                <div key={value.id} className={style.post_comment}>
                  <Avatar src={value.avatar} className={classes.small} />

                  <span className={style.post_commentUser}>
                    @{value.username}
                  </span>
                  <span className={style.post_commentText}>{value.text}</span>
                  <span className={style.post_headerTime}>
                    {new Date(value.timestamp?.toDate()).toLocaleString()}
                  </span>
                </div>
              );
            })}

            <form onSubmit={newComment}>
              <div className={style.post_form}>
                <input
                  className={style.post_input}
                  type="text"
                  placeholder="Type new comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  disabled={!comment}
                  type="submit"
                  className={
                    comment ? style.post_button : style.post_buttonDisable
                  }
                >
                  <SendIcon className={style.post_sendIcon} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
