// material-ui
import {
  Typography,
  Link,
  makeStyles,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  IconButton,
  Modal,
} from '@material-ui/core';
// react
import React, { useState } from 'react';
//redux
import { useDispatch } from 'react-redux';
//firebase
import { storage, provider, auth } from '../firebase';
import { updateProfile } from '../features/userSlice';
//style
import styles from './Auth.module.css';
// icon
import SendIcon from '@material-ui/icons/Send';
import CameraIcon from '@material-ui/icons/Camera';
import EmailIcon from '@material-ui/icons/Email';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { TypeFlags } from 'typescript';
import { Translate } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1473186578172-c141e6798cf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2766&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: 'none',
    position: 'absolute',
    width: 400,
    borderRadius: 10,
    backgroundColor: 'white',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

export const Auth: React.FC = () => {
  // modal style
  const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  };

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };
  const classes = useStyles();

  // dispatch
  const dispatch = useDispatch();

  // ?????????state
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // user????????????????????????state
  const [userName, setUserName] = useState('');
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  // email???password???????????????????????????????????????????????????
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  // signUp????????????(??????????????????????????????)
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);

    let url = '';
    if (avatarImage) {
      // random???ID??????????????????????????????
      const S =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      // ??????????????????????????????????????????????????????????????????
      const N = 16;
      // crypto.getRandomValues??????????????????????????????????????????????????????????????????
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('');

      const fileName = randomChar + '_' + avatarImage.name;
      // ref??????????????????????????????????????????avatars?????????????????????????????????????????????????????????
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      // ???????????????????????????url?????????
      url = await storage.ref('avatars').child(fileName).getDownloadURL();
    }
    // userProfile?????????
    await authUser.user?.updateProfile({
      displayName: userName,
      photoURL: url,
    });
    // dispatch???????????????
    dispatch(
      updateProfile({
        displayName: userName,
        photoUrl: url,
      })
    );
  };

  // isLogin?????????????????????????????????????????????????????????
  const isSignInInOrSignUp = async () => {
    if (isLogin) {
      // ???????????????
      try {
        await signInEmail();
      } catch (err) {
        alert(err.message);
      }
    } else {
      // ??????????????????
      try {
        await signUpEmail();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // passWord?????????????????????
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(true);
        setResetEmail('');
        alert('???????????????????????????????????????');
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail('');
      });
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // !???null?????????????????????????????????non null ?????????????????????????????????
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      // ?????????
      e.target.value = '';
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? '????????????' : '??????'}
          </Typography>
          <form className={classes.form} noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="??????"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        type="file"
                        className={styles.login_hiddenIcon}
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !userName || !email || password.length < 6 || !avatarImage
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<EmailIcon />}
              onClick={isSignInInOrSignUp}
            >
              {isLogin ? '????????????' : '??????'}
            </Button>
            <Grid container>
              <Grid item xs>
                {console.log(openModal)}
                <span
                  onClick={() => setOpenModal(true)}
                  className={styles.login_reset}
                >
                  ?????????????????????????????????
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? '?????????????????????' : '??????????????????'}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<CameraIcon />}
              className={classes.submit}
              onClick={signInGoogle}
            >
              Sign In with Google
            </Button>
          </form>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className={classes.modal} style={getModalStyle()}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};
