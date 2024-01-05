let chats = document.getElementById('chats');
let chatButton = document.getElementById("ChatButton")

chatButton.addEventListener("click",storeMessagestoBackend)

async function fetchUsers(){
    let response = await axios.get("http://localhost:3000/users/fetchusers")
    localStorage.setItem("userCount",response.data.userCount)
    let newUsers = response.data.users
    let ul = document.createElement('ul');

    newUsers.forEach((user,index) => {
        let currentUserEmail = localStorage.getItem("Email");
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
    getMessagesfromBackend();
}

fetchUsers()

async function storeMessagestoBackend(){
    let text = document.getElementById('text').value;
    let token = localStorage.getItem("token");
    let count = localStorage.getItem("userCount");

    if(count==="1"){
        alert("No users to send messages")
    } else {
        let response = await axios.post(`http://localhost:3000/message/storechat`,{
            message: text
        },{
            headers: {
                'Authorization': token
            }
        })

        document.getElementById('text').value = "";
        getMessagesfromBackend();
    }
    
}

async function getMessagesfromBackend() {
    let token = localStorage.getItem("token");
    let response = await axios.get(`http://localhost:3000/message/getmessages`, {
        headers: {
            'Authorization': token
        }
    });

    let messages = response.data.message;
    let users = response.data.user;
    let currentUserId = response.data.currentUserId;
    let chats = document.getElementById("chats");
    let chatDisplay = document.getElementById("chatText");
    let ul = document.createElement('ul');

    chatDisplay.innerHTML="";

    messages.forEach((message, index) => {
        let li = document.createElement('li');
        let userName;
        let userMessage;

        if (message.UserId === currentUserId) {
            userName = "You";
            userMessage = message.message;
        } else {
            users.forEach((user, index) => {
                if (user.id === message.UserId) {
                    userName = user.name;
                    userMessage = message.message;
                }
            });
        }

        li.textContent = userName + ": " + userMessage;
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
        chatDisplay.appendChild(ul);
        chats.appendChild(chatDisplay);
    });

    // Append the ul with all messages to the chat display outside the loop
    
}
