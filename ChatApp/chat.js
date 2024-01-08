let chats = document.getElementById('chats');
let chatButton = document.getElementById("ChatButton");
let chatDisplay = document.getElementById("chatText");
let textField = document.getElementById('textField');

let loadAllMessage = document.getElementById("oldmessage");
let loadNewMessage = document.getElementById("newmessage");

let groupButton = document.getElementById("createGroup");
const overlay = document.getElementById("overlay");

const groupForm = document.getElementById("groupForm");
const closeForm = document.getElementById("closeForm");

let NewMessage;
let AllMessage;

let userName;
let userMessage;

groupButton.addEventListener('click', createGroups);

function createGroups(event) {
        event.preventDefault();
        overlay.style.display = "block";
}

chatButton.addEventListener("click", storeMessagestoBackend);

async function storeMessagestoBackend() {
        let text = document.getElementById('text').value;
        let token = localStorage.getItem("token");
        let count = localStorage.getItem("userCount");

        if (count === "1") {
                alert("No users to send messages")
        } else {
                let response = await axios.post(`http://localhost:3000/message/storechat`, {
                        message: text
                }, {
                        headers: {
                                'Authorization': token
                        }
                })

                document.getElementById('text').value = "";
        }
}

loadNewMessage.addEventListener("click", fetchNewMessages);

async function fetchNewMessages() {
    loadNewMessage.disabled = true;
    loadAllMessage.disabled = false;
        clearInterval(AllMessage);
        appendNewMessage()

        NewMessage = setInterval(async () => {
                appendNewMessage()
        }, 1000)
}

loadAllMessage.addEventListener("click", fetchAllMessages);

async function fetchAllMessages() {
    loadNewMessage.disabled = false; 
    loadAllMessage.disabled = true; 
        clearInterval(NewMessage);
        AllMessage = setInterval(async () => {
                getMessagesfromBackend()
        }, 1000)
}



closeForm.addEventListener('click', function() {
        overlay.style.display = "none";
});

textField.addEventListener('click', function() {
    chatDisplay.style.display = 'none';
    chats.innerHTML="";
});

async function fetchUsers() {
        let response = await axios.get("http://localhost:3000/users/fetchusers")
        localStorage.setItem("userCount", response.data.userCount)
        let newUsers = response.data.users
        let ul = document.createElement('ul');

        newUsers.forEach((user, index) => {
                let currentUserEmail = localStorage.getItem("Email");
                let chatDisplay = document.getElementById("chats");
                let currentUser;


                let li = document.createElement('li');

                if (user.email === currentUserEmail) {
                        currentUser = "You"
                } else {
                        currentUser = user.name;
                }

                li.textContent = currentUser + " " + "joined";

                if (index % 2 == 0) {
                        li.style.backgroundColor = "#CCCCCC";
                        li.style.width = "88%"
                        li.style.borderRadius = "4px"
                } else {
                        li.style.backgroundColor = "#FFFFFF";
                        li.style.width = "88%"
                        li.style.borderRadius = "4px"
                }

                li.style.marginBottom = "1%"
                li.style.listStyleType = "none"

                ul.appendChild(li);
                chatDisplay.appendChild(ul)
        });

        appendNewMessage()

        NewMessage = setInterval(async () => {
                appendNewMessage()
        }, 1000)
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

                let messages = response.data.message.reverse();
                localStorage.setItem("recent", JSON.stringify(messages));

                displayLastTenMessages(response);

        } catch (error) {
                console.error("Error fetching messages:", error);
        }
}

function displayLastTenMessages(response) {
        let ul = document.createElement('ul');

        chatDisplay.innerHTML = "";
        ul.innerHTML = "";

        let newMessageString = localStorage.getItem("recent");
        let newMessage = JSON.parse(newMessageString);
        newMessage = newMessage.reverse();

        newMessage.forEach((message) => {
                let li = document.createElement('li');

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
        chats.appendChild(chatDisplay);
}

fetchUsers();