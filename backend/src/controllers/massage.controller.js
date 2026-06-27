



export const getUsersForSidebar= async(req,res)=>{
    try{
       const loggedInUserId = req.user._id;
       const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
       res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error in get users for sidebar controller",error.message);
        return res.status(500).json({message : "Internal server error"});
    }
}

export const getMessages = async(req,res)=>{
    try{
        const {id : userToChatId} = req.params;
        const myId = req.user._id;
        
        const massage = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
            }
        );
        res.status(200).json(massage); 
    }
    catch(error){
        console.log("Error in get messages controller",error.message);
        return res.status(500).json({message : "Internal server error"});
    }
}


export const sendMessage = async(req,res)=>{
    try{
         const { text , image } = req.body;
         const {id : receiverId} = req.params;
         const myId = req.user._id;


         let imageUrl;
         if(image){
            const uploadRespose = await cloudinary.uploader.upload(image);
            imageUrl = uploadRespose.secure_url;
         }

         const newMassage = new Massage({
            senderId:myId,
            receiverId,
            text,
            image:imageUrl
         });
         await newMassage.save();
         res.status(200).json(newMassage);
    }
    catch(error){
        console.log("Error in send message controller",error.message);
        return res.status(500).json({message : "Internal server error"});
    }
}