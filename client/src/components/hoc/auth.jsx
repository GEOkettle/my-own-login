import React from 'react';
import useStore from '../../../store/store';
import { useEffect } from 'react';
import {useNavigate,redirect } from 'react-router-dom';



//주석더하기
export default function (SpecificComponent, option, adminRoute = null) {

    const navigate = useNavigate();
    const {auth,setAccessToken,setLoginStatus,setUserInfo,setIsAdmin,isAdmin,accessToken}= useStore();
    // option = null // pages taht anyone can access
    // option = true // pages that only loginuser can access
    // option = false // pages that loginuser can not access
    // option = true ,adiminRoute = true // pages that only admin can access
function AuthenticationCheck(props){
useEffect(() => {

auth(accessToken).then(res => {
console.log(res)
    if (res.accessToken) {
    console.log(res)
    setAccessToken(res.accessToken)
    console.log(accessToken)
    setUserInfo(res.id, res.userid, res.role) 
if (res.role === 'Admin') { setIsAdmin(true) }
if (res.role === 'User') { setIsAdmin(false) }

}


if (res.isAuth===false) {

if (option) navigate('/test1')
} else { 
if (adminRoute && res.role !== "Admin")  navigate('/landing') 
else if (adminRoute && res.role === "Admin") redirect('/admin') 
else { if (option === false)  navigate('/landing') }}

})}, [])
return(<SpecificComponent {...props} />)}
    return AuthenticationCheck
}
