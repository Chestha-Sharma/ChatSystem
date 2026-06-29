import {create } from 'zustand' 
import { axiosInstance } from '../lib/axios'; 
import toast from 'react-hot-toast'; 
import { io } from 'socket.io-client'


const BASE_URL = 'http://localhost:5001';



const useAuthStore = create((set,get)=>({ //initial state
   authUser:null,
   isSigningUp:false,
   isLoggingIn:false,
   isUpdatingProfile:false,
   isCheckingAuth:true,
   onlineUsers:[],
   socket:null,

   checkAuth:async()=>{
    try{ 
      const res = await axiosInstance.get('/auth/check');
      set({authUser:res.data});
      get().connectSocket();
    }
    catch(error){
    console.log("Error in check auth store",error.message);
      set({authUser:null});
    } finally{
        set({isCheckingAuth:false});
    }
   },



   signup:async(data)=>{
    set({isSigningUp:true});
     try{ 
       const res =await axiosInstance.post('/auth/signup',data);
       set({authUser:res.data});
       toast.success('Account created successfully'); 
       get().connectSocket();
     }
     catch(error){
        toast.error(error.response.data.message);
     } finally{
         set({isSigningUp:false});
     }
   },

   
   logout :async()=>{
     try{
       await axiosInstance.post('/auth/logout');
       set({authUser:null});
       toast.success("Logged out Successfully");
       get().disconnectSocket();
     }
     catch(error){
      toast.error(error.response.data.message);
     }
   },


   login : async(data)=>{
    set({isLoggingIn:true});
     try{ 
       const res =await axiosInstance.post('/auth/login',data);
       set({authUser:res.data});
       toast.success('Logged in successfully'); 
       get().connectSocket();
     }
     catch(error){
        toast.error(error.response.data.message);
     } 
     finally{
         set({isLoggingIn:false});
     }
   },
    
    updateProfile : async(data)=>{
      set({isUpdatingProfile:true});
       try{ 
         const res =await axiosInstance.put('/auth/update-profile',data);
         set({authUser:res.data});
         toast.success('Profile updated successfully'); 
       }
       catch(error){
          toast.error(error.response.data.message);
       } 
       finally{
           set({isUpdatingProfile:false});
       }
    },

    connectSocket : async()=>{
      const authUser = get().authUser;
      if(!authUser || get().socket?.connected) return; //if not logged in or aready connected to socket
           const socket = io(BASE_URL,{
            query:{
            userId:authUser._id
            }
           });
           socket.connect();
           set({socket});

           socket.on('getOnlineUsers',(onlineUserIds)=>{
             set({onlineUsers : onlineUserIds});
           });
    },

    disconnectSocket : async()=>{
      if(get().socket?.connected)
       get().socket.disconnect();
      set({socket:null});
    },
}));
 
export default useAuthStore;





// Zustand aur Context same kaam karte hain — global state store karna. Bas syntax alag hai!

// Comparison:
// Context API (purana tarika)
// jsx// 3 alag files banana padta tha
// const AuthContext = createContext();

// const AuthProvider = ({children}) => {
//   const [authUser, setAuthUser] = useState(null);
//   return (
//     <AuthContext.Provider value={{authUser, setAuthUser}}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // use karne ke liye
// const {authUser} = useContext(AuthContext);
// Zustand (naya tarika)
// jsx// sirf ek file
// const useAuthStore = create((set) => ({
//   authUser: null,
//   setAuthUser: (user) => set({authUser: user})
// }));

// // use karne ke liye — bas itna!
// const {authUser} = useAuthStore();

// Zustand ke fayde:
// ContextZustandSetupZyada codeBahut kam codeProvider wrapmain.jsx mein wrap karna padtaKuch nahi karnaPerformanceRe-render zyadaSirf jo change hua wahi re-render