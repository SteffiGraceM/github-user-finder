async function getUser() {
  const username = document.getElementById("usernameInput").value;
  const userUrl = `https://api.github.com/users/${username}`;
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(userUrl),
      fetch(reposUrl)
    ]);

    if (!userRes.ok) {
      alert("User not found");
      return;
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Fill Profile Info
    document.getElementById("avatar").src = user.avatar_url;
    document.getElementById("name").textContent = user.name || username;
    document.getElementById("bio").textContent = user.bio || "";
    document.getElementById("followers").textContent = user.followers;
    document.getElementById("following").textContent = user.following;
    document.getElementById("publicRepos").textContent = user.public_repos;

    // Top 5 repos by stargazers_count
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5);

    const repoList = document.getElementById("repoList");
    repoList.innerHTML = "";

    topRepos.forEach(repo => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${repo.name}</span>
        <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-primary">View</a>
      `;
      repoList.appendChild(li);
    });

    document.getElementById("profileCard").classList.remove("d-none");
  } catch (error) {
    console.error(error);
    alert("Error fetching user data");
  }
}
