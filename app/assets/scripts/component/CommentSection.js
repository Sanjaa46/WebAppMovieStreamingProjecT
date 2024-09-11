export default class CommentSection {
    constructor() {
      this.comments = [];
    }
  
    render() {
      return `
      <style>
        * {
          margin: 0;
          padding: 0;
        }
  
        .container {
          background: #fff;
          padding: 20px;
          font-family: monospace;
          width: 500px;
          box-shadow: 0 0 5px #000;
        }
  
        .head {
          text-transform: uppercase;
          margin-bottom: 20px;
        }
  
        .commentbox {
          display: flex;
          justify-content: space-around;
          padding: 10px;
        }
  
        .commentbox > img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 20px;
          object-fit: cover;
          object-position: center;
        }
  
        .content {
          width: 100%;
        }
  
        .commentinput > input {
          border: none;
          padding: 10px;
          padding-left: 0;
          outline: none;
          border-bottom: 2px solid blue;
          margin-bottom: 10px;
          width: 95%;
        }
  
        .buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #808080;
        }
  
        .buttons > button {
          padding: 5px 10px;
          background: lightgrey;
          color: #808080;
          text-transform: uppercase;
          border: none;
          outline: none;
          border-radius: 3px;
          cursor: pointer;
        }
  
        .buttons > button.abled {
          background: blue;
          color: #fff;
        }
  
        .comments {
          margin: 10px 0;
          font-family: Arial, sans-serif;
          font-size: 0.9em;
        }
      </style>
  
      <div class="container">
        <div class="head"><h1>Post a Comment</h1></div>
        <div><span id="comment-count">0</span> Comments</div>
        <div class="comments" id="commentList">${this.renderComments()}</div>
        <div class="commentbox">
          <img src="user1.png" alt="">
          <div class="content">
            <h2>Comment as: </h2>
            <input type="text" value="Anonymous" class="user" disabled>
  
            <div class="commentinput">
              <input type="text" placeholder="Enter comment" class="usercomment">
              <div class="buttons">
                <button type="submit" id="publish" disabled>Publish</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }
  
    renderComments() {
      if (this.comments.length === 0) {
        return `<p>No comments yet. Be the first to comment!</p>`;
      }
  
      return this.comments.map(comment => `<p>${comment}</p>`).join('');
    }
  
    addComment(comment) {
      if (comment) {
        this.comments.push(comment);
        this.updateCommentList();
      }
    }
  
    updateCommentList() {
      const commentList = document.getElementById('commentList');
      if (commentList) {
        commentList.innerHTML = this.renderComments();
        document.getElementById('comment-count').textContent = this.comments.length;
      }
    }
  
    addEventListeners() {
      const submitButton = document.getElementById('publish');
      const commentInput = document.querySelector('.usercomment');
  
      commentInput.addEventListener('input', () => {
        submitButton.disabled = !commentInput.value.trim();
      });
  
      submitButton.addEventListener('click', () => {
        const newComment = commentInput.value.trim();
        if (newComment) {
          this.addComment(newComment);
          commentInput.value = ''; // Clear the input
          submitButton.disabled = true; // Disable the button again
        }
      });
    }
  }
  