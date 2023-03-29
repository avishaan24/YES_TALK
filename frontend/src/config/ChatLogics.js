export const getSender=(loggedUser,users)=>{
      return (users[0]._id===loggedUser._id)?users[1].name:users[0].name;
};

export const getSenderAll=(loggedUser,users)=>{
      return users[0]._id===loggedUser._id?users[1]:users[0];
};

export const isSameSenderMargin = (messages, m, i, userId) => {;
      if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
      )
        return 35;
      else if (
        (i < messages.length - 1 &&
          messages[i + 1].sender._id !== m.sender._id &&
          messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
      )
        return 0;
      else return "auto";
};
    
export const isSameSender = (messages, m, i) => {
      return (
            i>0&&(messages[i-1].sender._id===m.sender._id)
      )
};

export const isSame=(message,m,i,userId)=>{
      return (
            i<message.length-1&&(message[i+1].sender._id!==m.sender._id||message[i+1].sender._id===undefined)&&m.sender._id!==userId
      )
};

export const isLast=(message,i,userId)=>{
      return (
            i===message.length-1&&message[i].sender._id!==userId
      )
};