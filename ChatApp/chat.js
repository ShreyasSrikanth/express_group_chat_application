let chats = document.getElementById('chats');

async function fetchUsers(){
    let response = await axios.get("http://localhost:3000/users/fetchusers")
    let newUsers = response.data.users


    newUsers.forEach((user,index) => {
        console.log(user.name)
        let chatDisplay = document.getElementById("chats");

        let ul = document.createElement('ul');
        let li = document.createElement('li');

        li.textContent = user.name + " " + "joined";

        if(index % 2 == 0){
            li.style.backgroundColor="gray";
            li.style.width="88%"
            li.style.borderRadius = "4px"
        } else {
            li.style.backgroundColor= "white";
            li.style.width="88%"
            li.style.borderRadius = "4px"
        }

        li.style.listStyleType = "none"

        ul.appendChild(li);
        chatDisplay.appendChild(ul)
    });
}

fetchUsers()