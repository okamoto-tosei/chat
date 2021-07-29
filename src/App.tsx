import React,{useEffect} from 'react';
import styles from './App.module.css';
import {useSelector, useDispatch} from 'react-redux'
import {selectUser,login, logout} from './features/userSlice'
import {auth} from './firebase'

import Feed from './components/Feed';
import { Auth } from './components/Auth';

const App:React.FC = () => {
  // useSliceで定義しているvalueの取得
  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  useEffect(() => {
    // userの値が変化した時に実行される関数　実行されるとuserの監視を始める
    const unSub = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        dispatch(login({
          uid: authUser.uid,
          photoUrl: authUser.photoURL,
          displayName: authUser.displayName
        }))
      } else {
        dispatch(logout());
      }
    })

    // cleanUp
    return () => {
      unSub()
    }
  },[dispatch])

  return (
    <>
    {user.uid ?
      <div className={styles.app}>
        <Feed /> 
      </div>
      : 
      <Auth />
    }  
    </>
  );
}

export default App;
