
// Git Hub Query
// queries the GitHub repo for the number of commits in the EDrewcated Guesser repo.

// Code taken from https://gist.github.com/yershalom/a7c08f9441d1aadb13777bce4c7cdc3b?permalink_comment_id=3278742#gistcomment-3278742
// I know it's deprecated, but I've already spent an hour and a half on this single feature, and need to move on.

console.log("Counting commits...")
  const base_url = 'https://api.github.com';

  function httpGet(theUrl, return_headers) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", theUrl, false); // false for synchronous request
      xmlHttp.send(null);
      if (return_headers) {
          return xmlHttp
      }
      return xmlHttp.responseText;
  }

  function get_all_commits_count(owner, repo, sha) {
      let first_commit = get_first_commit(owner, repo);
      let compare_url = base_url + '/repos/' + owner + '/' + repo + '/compare/' + first_commit + '...' + sha;
      let commit_req = httpGet(compare_url);
      let commit_count = JSON.parse(commit_req)['total_commits'] + 1;
      console.log('Commit Count: ', commit_count);
      return commit_count
  }
  
  function get_first_commit(owner, repo) {
      let url = base_url + '/repos/' + owner + '/' + repo + '/commits';
      let req = httpGet(url, true);
      let first_commit_hash = '';
      if (req.getResponseHeader('Link')) {
          let page_url = req.getResponseHeader('Link').split(',')[1].split(';')[0].split('<')[1].split('>')[0];
          let req_last_commit = httpGet(page_url);
          let first_commit = JSON.parse(req_last_commit);
          first_commit_hash = first_commit[first_commit.length - 1]['sha']
      } else {
          let first_commit = JSON.parse(req.responseText);
          first_commit_hash = first_commit[first_commit.length - 1]['sha'];
      }
      return first_commit_hash;
  }
  
  let owner = 'DrewWing';
  let repo = 'EDrewcatedGuesser';
  let sha = 'main';
  document.getElementById("EDrewcatedGuesserCommitCount").innerHTML = get_all_commits_count(owner, repo, sha);
  console.log("Commit count is complete.")