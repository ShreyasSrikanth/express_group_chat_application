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

    getMessagesfromBackend()

    setInterval(async()=>{
        appendNewMessage()
    },1000)
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
    }
    // setInterval(async()=>{
    //     getMessagesfromBackend()
    // },1000)
}

async function appendNewMessage() {
    let token = localStorage.getItem("token");
    let response = await axios.get(`http://localhost:3000/message/getNewMessage`, {
        headers: {
            'Authorization': token
        }
    });
    localStorage.setItem("recent", JSON.stringify(response.data.newMessage));
    displayLastTenMessages(response);
}

async function getMessagesfromBackend() {
    try {
        let token = localStorage.getItem("token");
        let response = await axios.get(`http://localhost:3000/message/getmessages`, {
            headers: {
                'Authorization': token
            }
        });

        let messages = response.data.message;
        let users = response.data.user;
        let currentUserId = response.data.currentUserId;

        let lastTenMessages = messages.slice(-10);
        localStorage.setItem("recent", JSON.stringify(lastTenMessages));

        displayLastTenMessages(response);
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

function displayLastTenMessages(response) {
    let chatDisplay = document.getElementById("chatText");
    let ul = document.createElement('ul');

    chatDisplay.innerHTML = "";

    let newMessageString = localStorage.getItem("recent");
    let newMessage = JSON.parse(newMessageString);
    newMessage = newMessage.reverse();

    newMessage.forEach((message) => {
        let li = document.createElement('li');
        let userName;
        let userMessage;

        if (message.UserId === response.data.currentUserId) {
            userName = "You";
            userMessage = message.message;
        } else {
            if (response.data.user && Array.isArray(response.data.user)) {
                let user = response.data.user.find(user => user.id === message.UserId);
                userName = user ? user.name : "Unknown";
            } else {
                userName = "Unknown";
            }
            userMessage = message.message;
        }

        li.textContent = `${userName}: ${userMessage}`;
        li.style.backgroundColor = ul.children.length % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
        li.style.width = "88%";
        li.style.borderRadius = "4px";
        li.style.marginBottom = "1%";
        li.style.listStyleType = "none";

        ul.appendChild(li);
    });

    chatDisplay.appendChild(ul);
    document.getElementById("chats").appendChild(chatDisplay);
}


