import create from 'zustand'
import {devtools} from 'zustand/middleware'
import axios from '../plugin/axios.jsx';

const store = (set) => ({

setUserInfo: (id, userid, role) => set({
userInfo:{
id: id,
userid: userid,
role: role
}
}),


isSignIn: true,
setIsSignIn: (status) => set({ isSignIn: status }),
isAdmin: false,
setIsAdmin: (status) => set({ isAdmin : status }),
accessToken: '',
setAccessToken: (token) => set({ accessToken: token }),

loginfetch: async (dataToSubmit) => {
const result = await axios.post('api/user/login', dataToSubmit,{ withCredentials: true })
.then(res => res.data)
return result;
},

registerfetch: async (resigterInfo) => { 
const result = await axios.post('api/user/register', resigterInfo)
.then(res => res.data);
return result;
},

auth: async (accessToken) => {
const result = await axios.get('api/user/auth', { headers: { 'authorization': accessToken } })
.then(res => res.data);
return result;
}

})
    
const useStore = create(devtools(store));





export default useStore;