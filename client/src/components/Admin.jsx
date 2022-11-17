import React, { useEffect} from 'react'
import useStore from '../../store/store'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
function Admin() {
    const { accessToken,isAdmin} = useStore()
    useEffect(() => { 
        console.log('accessToken : '+accessToken)
        console.log('isAdmin : '+isAdmin)
    },[])
  return (
    <AdminFrame>
      <Back><StyledLink to='./test2'><GetBigger>이전으로</GetBigger></StyledLink></Back>
    <Greeting>    
        이곳은
        <br />
        <br />
        <br />
        <br />
        관리자페이지입니다.
    </Greeting>
    </AdminFrame>
  )
}

export default Admin

const AdminFrame = styled.div`
  
  min-height:100vh;
  min-width:100vw;
  background-color:black;
  font-size: 5rem;
  font-weight:900;
  color: white;

  
`
const Greeting =styled.div`
     position:fixed;
   /* height: 1500px; */
    top:50%;
    left :50%;
    transform: translateY(50%);
    transform: translateX(-50%);
`
const Back =styled.div`
     position:fixed;
   /* height: 1500px; */
    top:10%;
    left :10%;
    transform: translateY(50%);
    transform: translateX(-50%);
`

const StyledLink = styled(Link)`
  text-decoration:none;
  color:white;
  font-weight:900;
`

const GetBigger = styled.span`
&:hover{
color :white;
font-size:5.5rem;


}
cursor: pointer;
`