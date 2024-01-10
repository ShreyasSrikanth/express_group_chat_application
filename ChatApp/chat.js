let chats = document.getElementById('chats');
let chatButton = document.getElementById("ChatButton");
let chatDisplay = document.getElementById("chatText");
let textField = document.getElementById('textField');

let loadAllMessage = document.getElementById("oldmessage");
let loadNewMessage = document.getElementById("newmessage");

let groupForm = document.getElementById('groupForm');
let groupButton = document.getElementById("createGroup");
const overlay = document.getElementById("overlay");
const groupFormDiv = document.getElementById("groupFormDiv");
const addGroupMembers = document.getElementById('addGroupMembers');
const sendgrpInfo = document.getElementById('sendgrpInfo');
let GroupChats = document.getElementById('groups');
let groupUserIds;

const closeForm = document.getElementById("closeForm");

let NewMessage;
let NewGroupMessage;
let AllMessage;
let NewAllGroupMessage;
let userName;
let userMessage;
let groups = [];
let chatgroupusers;
let normalchats = true;
let groupAdmin;

groupButton.addEventListener('click', createGroups);

async function createGroups(event) {
    event.preventDefault();
    overlay.style.display = "block";

    let response = await fetchUsers();
    let groupMembers = response.data.users;

    let ul = document.createElement('ul');     

groupMembers.forEach((user) => {
    let li = document.createElement('li'); 
    let userName = document.createTextNode(user.name);
    let addButton = document.createElement('button');
    addButton.textContent = 'Add';

    
    let isBackgroundGreen = false;

    addButton.addEventListener('click', function(e) {
        e.preventDefault();
        let groupuserId = user.id;
        
        if (isBackgroundGreen) {
            li.style.backgroundColor = ''; 
            addButton.textContent = 'Add';
            groups.pop(groupuserId)

        } else {
            li.style.backgroundColor = 'green'; 
            addButton.textContent = 'Remove';
            groups.push(groupuserId);
        }
        isBackgroundGreen = !isBackgroundGreen;
    });
    
    
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.width = "100%";
    li.style.marginBottom = "10px";

    addButton.style.backgroundColor = "rgb(175, 110, 24)";
    addButton.style.border = "none";
    addButton.style.fontSize = "x-small";
    addButton.style.color = 'white';
    addButton.style.borderRadius = "5px";
    addButton.style.height = "15px";

    li.appendChild(userName);
    li.appendChild(addButton);
    ul.appendChild(li);
});
    let membersContainer = document.getElementById('members');
    membersContainer.innerHTML = '';
    membersContainer.appendChild(ul);
}

sendgrpInfo.addEventListener('click',userGroups)

async function userGroups(){
    let token = localStorage.getItem("token");
    let groupName = document.getElementById('grpName').value;


    let response = await axios.post(`http://localhost:3000/groups/createGroups`,{
        groupName:groupName,
        groupUsers:groups
    },{
        headers:{
            'Authorization':token
        }
    })

    if(response.status===200){
        alert(response.data.message)
        console.log(response.data.newGroup)
    }
}

// GroupChats.addEventListener('click',displaygroupMessages);



async function fetchUserGroup() {
    let token = localStorage.getItem("token");
    let response = await axios.get(`http://localhost:3000/groups/fetchgroups`, {
        headers: {
            'Authorization': token
        }
    });

    response.data.groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.textContent = `${group.groupname}`;
        localStorage.setItem(groupDiv.textContent, group.id);
        groupDiv.classList.add('group-name');
        GroupChats.appendChild(groupDiv);

        groupDiv.addEventListener('click', async function() {
            const groupName = this.textContent;
            let groupId = localStorage.getItem(groupName);
            await displayGroupUsers(groupName, groupId);
        });
    });

    groupUserIds = response.data.groups;
}

let usergroup

async function displayGroupUsers(groupName, groupId){
        clearInterval(AllMessage);
        clearInterval(NewMessage);
        chats.innerHTML=""
    
        normalchats = false;
    
        let token = localStorage.getItem("token");
    
        let response = await axios.get(`http://localhost:3000/groups/fetchgroupUsers?groupId=${groupId}`, {
            headers: {
                'Authorization': token
            }
        });
    
        // console.log(response.data.groupmembers);
        chatgroupusers = response.data.groupmembers;
        groupAdmin = response.data.groupadminId
    
        displayUsers();
}



chatButton.addEventListener("click",sendMesssage);

async function sendMesssage(){
        if(normalchats===true){
                await storeMessagestoBackend();
        } else {
                await storeGroupMessages()
        }
}

async function storeGroupMessages(){
        let text = document.getElementById('text').value;
        let token = localStorage.getItem("token");
        let groupId = chatgroupusers[0].UserGroup.groupId;
        
        let response = await axios.post(`http://localhost:3000/groupmessageRoute/fetchgroupUsers`, {
                message: text,
                groupId:groupId
        },{
                headers: {
                        'Authorization': token
                }
        })
        document.getElementById('text').value = "";
}



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
        clearInterval(NewAllGroupMessage)
        if(normalchats===true){
                clearInterval(NewGroupMessage);
                clearInterval(NewMessage);

                appendNewMessage()
        
                NewMessage = setInterval(async () => {
                        appendNewMessage()
                }, 1000)
            } else{
                clearInterval(NewGroupMessage);
                clearInterval(NewMessage);

                appendGroupMessage();
        
                NewGroupMessage = setInterval(async () => {
                        appendGroupMessage()
                }, 1000)
            }
}

loadAllMessage.addEventListener("click", fetchAllMessages);

async function fetchAllMessages() {
    loadNewMessage.disabled = false; 
    loadAllMessage.disabled = true; 
        clearInterval(NewMessage);
        clearInterval(NewGroupMessage);
       
        if(normalchats===true){
                clearInterval(AllMessage);
                clearInterval(NewAllGroupMessage);

                getMessagesfromBackend();
                AllMessage = setInterval(async () => {
                        getMessagesfromBackend()
                }, 1000)
        } else {
                clearInterval(AllMessage);
                clearInterval(NewAllGroupMessage);

                getAllGroupMessagesfromBackend();
                NewAllGroupMessage = setInterval(async () => {
                        getAllGroupMessagesfromBackend();
                }, 1000)
        }
}



closeForm.addEventListener('click', function() {
        overlay.style.display = "none";
});

textField.addEventListener('click', function() {
    chatDisplay.style.display = 'block';
    chats.innerHTML="";
    normalchats = true;
    clearInterval(NewGroupMessage);
    clearInterval(NewMessage);
    displayUsers();
});




async function fetchUsers() {
    let response = await axios.get("http://localhost:3000/users/fetchusers")
    localStorage.setItem("userCount", response.data.userCount)
    return response
}

async function displayUsers() {
        let response1 = await fetchUsers();
        let response2 = chatgroupusers;
        let newUsers;
        
        if(normalchats===true){
            newUsers = response1.data.users;
        } else {
            newUsers = response2
        }

        
        let groupUsers = response2;

        let ul = document.createElement('ul');

        newUsers.forEach((user, index) => {
                let currentUserEmail = localStorage.getItem("Email");
                let currentUser;


                let li = document.createElement('li');

                if (user.email === currentUserEmail) {
                        currentUser = "You"
                } else {
                        currentUser = user.name;
                }

                if(normalchats===true){
                        li.textContent = currentUser + " " + "joined";
                } else{
                        if (user.id===groupAdmin){
                                li.textContent = currentUser + " "  + "                   "+"admin" ;
                        } else {
                                li.textContent = currentUser + " " + "joined"
                        }
                }


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
                chats.appendChild(ul)
        });
        
    if(normalchats===true){
        clearInterval(NewGroupMessage);
        appendNewMessage()

        NewMessage = setInterval(async () => {
                appendNewMessage()
        }, 1000)
    } else{
        clearInterval(NewGroupMessage);
        clearInterval(NewMessage);
        appendGroupMessage()

        NewGroupMessage = setInterval(async () => {
                appendGroupMessage()
        }, 1000)
    }
        
}



async function getAllGroupMessagesfromBackend() {
        try {
                let token = localStorage.getItem("token");
                let groupId = chatgroupusers[0].UserGroup.groupId;

                let response = await axios.get(`http://localhost:3000/groupmessageRoute/fetchallgroupmessages?groupId=${groupId}`, {
                        headers: {
                                'Authorization': token
                        }
                });
                
                localStorage.setItem("recent", JSON.stringify(response.data.newMessage));

                displayLastTenMessages(response);

        } catch (error) {
                console.error("Error fetching all group messages:", error);
        }
}


async function appendGroupMessage() {

        let token = localStorage.getItem("token");
        let groupId = chatgroupusers[0].UserGroup.groupId;

        let response = await axios.get(`http://localhost:3000/groupmessageRoute/fetchgroupmessages?groupId=${groupId}`, {
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

async function appendNewMessage() {

        let token = localStorage.getItem("token");
        let response = await axios.get(`http://localhost:3000/message/getNewMessage/`, {
                headers: {
                        'Authorization': token
                }
        });

        localStorage.setItem("recent", JSON.stringify(response.data.newMessage));
        displayLastTenMessages(response);
}

function displayLastTenMessages(response) {
        let ul = document.createElement('ul');

        chatDisplay.innerHTML = "";
        ul.innerHTML = "";

        let newMessageString = localStorage.getItem("recent");
        let newMessage = JSON.parse(newMessageString);
        newMessage = newMessage.reverse();

        if(normalchats===true){
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
        
        } else {
                newMessage.forEach((message) => {
                        let li = document.createElement('li');

                        if (message.UserId === response.data.currentUserId) {
                                userName = "You";
                                userMessage = message.message;
                        } else {
                                if (message.UserId === message.User.id) {
                                        userName = message.User.name;
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
                })
        }
 
        chatDisplay.appendChild(ul);
        chats.appendChild(chatDisplay);
}

displayUsers();
fetchUserGroup();