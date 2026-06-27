import {create } from 'zustand' 
import { axiosInstance } from '../lib/axios'; 
import toast from 'react-hot-toast';
const useAuthStore = create((set)=>({ //initial state
   authUser:null,
   isSigningUp:false,
   isLoggingIn:false,
   isUpdatingProfile:false,
   isCheckingAuth:true,

   checkAuth:async()=>{
    try{
      const response = await checkAuth();
      const res = await axiosInstance.get('/auth/check');
      set({authUser:res.data});
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
     }
     catch(error){
        toast.error(error.response.data.message);
     } finally{
         set({isSigningUp:false});
     }
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