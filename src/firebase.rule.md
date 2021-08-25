```
service cloud.firestore {
  match /databases/{database}/documents {

    // ユーザーがログインしていたらtrue返す
    function isAuthenticated() {
    	return request.auth != null
    }

    // posts以下の読み込みと書き込みを許可している。
    {postId=**}でposts以下のデータ構造全てに適用される。
    match /posts/{postsId=**} {
    	allow read, create: if isAuthenticated();
    }
  }
}
```
