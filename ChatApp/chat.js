let chats = document.getElementById('chats');

async function fetchUsers(){
    let response = await axios.get("http://localhost:3000/users/fetchusers")
    let newUsers = response.data.users
    let ul = document.createElement('ul');

    newUsers.forEach((user,index) => {
        let currentUserEmail = localStorage.getItem("Email")
        let chatDisplay = document.getElementById("chats");
        let currentUser;

        
        let li = document.createElement('li');

        if(user.email === currentUserEmail){
            currentUser = "You"
        } else {
            currentUser = user.name;
        }

        li.textContent = currentUser + " " + "joined";

        if(index % 2 == 0){
            li.style.backgroundColor="#CCCCCC";
            li.style.width="88%"
            li.style.borderRadius = "4px"
        } else {
            li.style.backgroundColor= "#FFFFFF";
            li.style.width="88%"
            li.style.borderRadius = "4px"
        }

        li.style.marginBottom = "1%"
        li.style.listStyleType = "none"

        ul.appendChild(li);
        chatDisplay.appendChild(ul)
    });
}

fetchUsers()