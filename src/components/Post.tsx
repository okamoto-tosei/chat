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

const Post: React.FC<PropsType> = (props) => {
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
                {new Date(props.timestamp.toDate()).toLocaleString()}
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
      </div>
    </div>
  );
};

export default Post;
