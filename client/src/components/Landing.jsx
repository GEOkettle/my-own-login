import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import usestore from '../../store/store'
import {Link,useNavigate} from 'react-router-dom'
import { NotionRenderer } from 'react-notion';
import axios from '../../plugin/axios';
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
function Landing() {
const { isAdmin,setAccessToken } = usestore()
const [blockMap, setBlockMap] = useState({})
const navigate = useNavigate()
const [anchorList, setAnchorList] = useState([])
useEffect(() => { 
async function getNotion() { 
const notionData =await fetch(`https://notion-api.splitbee.io/v1/page/5238c13f4457483594104ea57d2e6e59`).then(res => res.json())
setBlockMap(notionData)
}
getNotion();
}, [])
const logoutHandler = () => {
axios.get('/api/user/logout')
.then((res) => {
if(res.data.logoutsuccess){
setAccessToken('');
navigate('/login')
}else{
alert("Logout failed")
}})
}
const goToH1 = (e, idx) => {
e.preventDefault()
document.getElementsByTagName('h1')[idx].scrollIntoView();
return false;
}
useEffect(() => { 
//직접돔에 접근 할 수 밖에없겠
const h1 = document.getElementsByClassName("notion-h1")
const array =[]
for (let i = 0; i < h1.length; i++) { 
const section =document.createElement('section')
section.setAttribute('id', 'anchor' + (i + 1))
section.setAttribute('style','min-height:1px')
h1[i].insertAdjacentElement('beforebegin',section)
array.push(h1[i].innerHTML)
}
setAnchorList(array)
}, [blockMap])
const goToUp = () => { 
window.scrollTo({ top: 0, behavior: 'smooth' })
}
return (
<Frame>
<Index>
{anchorList.map((txt, idx)=>{ 
return (
<Adiv key={idx} style={{margin:'20px 0 0 50px'}}>
<StyledA onClick={(e)=>goToH1(e,idx)} href={'#anchor' + (idx + 1)}>{idx + 1}{txt}</StyledA>
</Adiv>
)
})}
</Index>
<NotionFrame>
<NotionRenderer fullPage={true} blockMap={blockMap}/>
</NotionFrame>
<RemoteController>      
<RemoteContainer>
<div>{isAdmin ? <StyledLink to='/admin'>관리자페이지로</StyledLink> : <p style={{ color: 'grey'}}>관리자페이지</p>}</div>
<div><StyledButton onClick={logoutHandler}>로그아웃</StyledButton></div>   
<div style={{display:'flex',justifyContent:'center'}}><StyledUp onClick={goToUp}>위로가기</StyledUp></div>
</RemoteContainer>
</RemoteController>
</Frame>
)
}

export default Landing

const Frame = styled.div`
width:100vw;
height:100%;
justify-content:space-between;
.notion-page-header{
display:none;
}
`
const RemoteController = styled.div`
position: fixed;
top: 5%;
right: 0;
width: 20%;
margin :20% auto;
height: 100vh;
@media screen and (max-width: 1170px) {
display:none;
}
div{
margin: 0 0 0 30px;
}
`
const RemoteContainer = styled.div`
border: 2px solid black;
width: 150px;
height:200px;
display:flex;
flex-direction:column;
justify-content:space-around;
div{
text-align:center;
margin: 0 5px 0 0;
}
`

const Index = styled.div`
position: fixed;
top: 5%;
left: 0;
width: 20%;
margin :20% auto;
height: 100vh;
@media screen and (max-width: 1170px) {
display:none;
}
`

const NotionFrame = styled.div`
min-width: 50%;
min-height: 100vh;
`

const StyledA = styled.a`
text-decoration: none;
font-weight : 600;
color:black;
&:hover{
color: white;
background-color:black;
}
`
const StyledUp = styled.div`
cursor: pointer;
width:100px;
&:hover{
color: white;
background-color:black;
}
`
const StyledLink = styled(Link)`
text-decoration:none;
color:black;
&:hover{
color:white;
background-color:black;
}
`
const StyledButton = styled.button`
border: none;
background-color:white;
&:focus {
border: none;
outline: none;
background-color:black;
color:white
}
&:hover {
background-color:black;
color:white
}
`

const Adiv = styled.div`
@media screen and (max-width: 1180px) {
    padding: 0 0 0 10px;
    }
.active{
    text-decoration:underline;
    font-weight: 900;
    }
    
`