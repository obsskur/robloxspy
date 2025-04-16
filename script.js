async function lookupUser() {
  const username = document.getElementById("usernameInput").value;
  if (!username) return alert("Please enter a username!");

  try {
    // Get User ID
    const res = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    const data = await res.json();
    const user = data.data[0];
    if (!user) return alert("User not found!");

    const userId = user.id;
    document.getElementById("displayName").textContent = user.displayName;
    document.getElementById("userId").textContent = user.id;

    // Creation Date
    const infoRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const infoData = await infoRes.json();
    document.getElementById("createdDate").textContent = new Date(infoData.created).toLocaleDateString();

    // Past Usernames
    const pastRes = await fetch(`https://users.roblox.com/v1/users/${userId}/username-history?limit=50&sortOrder=Desc`);
    const pastData = await pastRes.json();
    const pastNames = pastData.data.map(x => x.name).join(", ");
    document.getElementById("pastNames").textContent = pastNames || "None";

    // Followers
    const followerRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
    const followerData = await followerRes.json();
    document.getElementById("followers").textContent = followerData.count;

    // Friends
    const friendsRes = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
    const friendsData = await friendsRes.json();
    document.getElementById("friendCount").textContent = friendsData.data.length;
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = "";
    friendsData.data.forEach(friend => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" onclick="lookupFriend('${friend.name}')">${friend.name}</a>`;
      friendsList.appendChild(li);
    });

    // Groups
    const groupRes = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
    const groupData = await groupRes.json();
    document.getElementById("groupCount").textContent = groupData.data.length;
    const groupList = document.getElementById("groupList");
    groupList.innerHTML = "";
    groupData.data.forEach(group => {
      const li = document.createElement("li");
      li.textContent = `${group.group.name} (${group.role}, ${group.group.memberCount} members)`;
      groupList.appendChild(li);
    });

    document.getElementById("result").classList.remove("hidden");

  } catch (error) {
    alert("Failed to fetch data. Possibly rate limited or user doesn't exist.");
    console.error(error);
  }
}

function toggleDropdown(id) {
  const el = document.getElementById(id);
  el.classList.toggle("hidden");
}

function lookupFriend(name) {
  document.getElementById("usernameInput").value = name;
  lookupUser();
}
