import React from 'react'
import {useState,useEffect} from'react'
import styled from 'styled-components'
import useStore from '../../store/store';



function SignIn() { 
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const { loginfetch, setAccessToken,setIsAdmin } = useStore();


     //prevent default submit
    const onUseridHandler = (e) => { 
        setUserID(e.target.value);
    }
    const onPasswordHandler = (e) => { 
        setPassword(e.target.value);
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();

        let loginInfo = {
            userid: userID,
            password: password
    
        }
     //이거 auth에서해주면되지않나?
        
        loginfetch(loginInfo)
            .then(res => {
                console.log('1 : 서버로부터의응답을 받음. 로그인정보가 틀리면 오류창을 띄우고 맞으면 스토어에 엑세스토큰을 세팅함')
                console.log(res)
                if(res.role==='Admin') setIsAdmin(true)
                if(res.role==='User') setIsAdmin(false)
                if (res.loginsuccess) {
                    setAccessToken(res.accessToken)
                    
                } else { 
                    alert(res.error)
                }
            });
            
            
        }
   
    return (
          <LoginContainer>
                  <span style={{fontSize:"1.8rem",fontWeight:"700",margin:"20px 0 0 0"}} > Sign In</span>
                  <form onSubmit={e => onSubmitHandler(e)} >
            <InputDiv>
              <label>ID</label>
                <input type="text" id='userID' name='userID' value={userID} onChange={e=>onUseridHandler(e)}  />
            </InputDiv>
            <InputDiv >
              <label>Password</label>
                <input type="password" id='password' name='password' value={password} onChange={e=>onPasswordHandler(e)} />
            </InputDiv>
            <LoginButton type='submit'> Sign In</LoginButton>
            </form>
            <br />
            <br />
              </LoginContainer>
    )
}

function SignUp() { 
      const { registerfetch,setIsSignIn } = useStore();

    const [userID , setUserID] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [ PW, setPW ] = useState('');
    const [PWCheck, setPWCheck] = useState('');
    const [error, setError] = useState([]);

    const onIDHandler = (e) => { 
        setUserID(e.target.value)
    }
    const onEmailHandler = (e) => { 
        setEmail(e.target.value)
    }
    const onNameHandler = (e) => { 
        setName(e.target.value)
    }
    const onPWHandler = (e) => { 
        setPW(e.target.value)
    }
    const onPWCheckHandler = (e) => { 
        setPWCheck(e.target.value)
    }

    const onSubmitHandler = (e) => { 
        e.preventDefault()

        if(PW!==PWCheck){
            alert("비밀번호가 일치하지 않습니다.")
            return
        }
        let registerInfo = {
            userid: userID,
            email: email,
            name: name,
            password: PW
        }
        registerfetch(registerInfo)
            .then( res =>  {
                if (res.error) { 
                     console.log(res)
                     alert(res.error.message)
                    // setError([res.error.message]);
                    // let errorSplit = res.error.message.split('/')
                    // for (var i in errorSplit) { 
                    //         // console.log(errorSplit)
                    //     if (errorSplit[i] !== '') { 
                    //         if (errorSplit[i].slice(0, 1) == ',') { 
                    //         errorSplit[i] = errorSplit[i].substring(1)
                    //         }
                    //         const err = errorSplit[i].trim()
                            
                    //         if (err !=='') {
                    //         setError(oldarray => [...oldarray, err])
                    //         }
                            
                    //         //mysweetalert2로 교체하자거
                            
                    //     }
                    // }
                } else if(res.success){ 
                    alert("환영합니다^오^")
                    setIsSignIn(true)
                }
              
            })
    }

    return (
        <RegisterContainer>
            <br />
               <span style={{fontSize:"1.5rem",fontWeight:"700"}}> Sign Up </span>
              <form  style={{ margin:"10px 0 0 0"}} onSubmit={onSubmitHandler}>
              <InputDiv>
              <label>ID</label>
                <input  onChange={e=> onIDHandler(e)} value={userID} type="text"  />
            </InputDiv>
              <InputDiv>
              <label>Email</label>
                <input  onChange={e=> onEmailHandler(e)} value={email} type="email" />
            </InputDiv>
              <InputDiv>
              <label>Name </label>
                <input  onChange={e=> onNameHandler(e)} value={name} type="text" />
            </InputDiv>
              <InputDiv>
              <label>Password</label>
                <input   onChange={e=> onPWHandler(e)} value={PW} type="password" />
            </InputDiv>
              <InputDiv>
              <label>Confirm Password </label>
                <input onChange={e=> onPWCheckHandler(e)} value={PWCheck} type="password" />
            </InputDiv>
            <RegisterButton type="submit">Sign Up</RegisterButton>
              </form>
              <br />

                 
          </RegisterContainer>
    )
}


function Sign() {

    // const [isSignIn, setIsSignIn] = useState(true);
     const { isSignIn, setIsSignIn} = useStore();

  return (
    <>
      <Description className='notion-code language-plain text'>
        <p style={{color:'white',fontWeight:"700"}}>체험용 관리자/유저 계정입니다. 가입이 번거로우시면 시도하세요.</p>
    <pre class="notion-code language-plain text"><code class="language-plain text"><span class="token punctuation">&#123;</span>
    <span class="token string-property property">"role"</span><span class="token operator">:</span><span class="token string">"User"</span><br/>
    <span class="token string-property property">"userid"</span> <span class="token operator">:</span> <span class="token string">"myownlogin"</span><span class="token punctuation">,</span><br/>
    <span class="token string-property property">"password"</span><span class="token operator">:</span><span class="token string">"12345!@#$%Zx"</span><span class="token punctuation"></span>
    <span class="token punctuation">&#125;</span></code></pre>
    <pre class="notion-code language-plain text"><code class="language-plain text"><span class="token punctuation">&#123;</span>
    <span class="token string-property property">"role"</span><span class="token operator">:</span><span class="token string">"Admin"</span><br/>
    <span class="token string-property property">"userid"</span> <span class="token operator">:</span> <span class="token string">"Admin"</span><span class="token punctuation">,</span><br/>
    <span class="token string-property property">"password"</span><span class="token operator">:</span><span class="token string">"12345!!Zx"</span><span class="token punctuation"></span>
    <span class="token punctuation">&#125;</span></code></pre>
      </Description>
      <Frame>
          <Toggle>
            
              <div onClick={() => { setIsSignIn(true);  }} style={ isSignIn? {background:'black',color:'white',border:'1px solid black'}: {background:'none'} }>Sign In</div>
              <div onClick={() => { setIsSignIn(false); } } style={ isSignIn? {background:'none'}:{background:'black',color:'white',border:'1px solid black'}  }>Sign Up</div>
          </Toggle>
          {isSignIn ? <SignIn /> : <SignUp />}
   </Frame>
    </>
  )
}

export default Sign

const Frame = styled.div`
    @media screen and (min-width: 900px) and (max-width: 1190px) {
        width:30%;
        overflow-y:scroll;
    }
    @media screen  and (min-width: 650px)  and (max-width: 900px) {
        width:50%;
        height:50%;
        overflow-y:scroll;
    }
    @media screen  and (min-width: 501px)  and (max-width: 650px) {
        width:60%;
        height:45%;
        overflow-y:scroll;
    }
    @media screen and (max-width: 500px) {
        width:70%;
        overflow-y:scroll;
    }
    position:absolute;
    top: 65%;
    left:50%;
     transform: translate(-50%, -50%);
     background-color:white;
    /* border:1px solid #24db70; */

    box-shadow : 0 0 1px 1px  black;
    display:flex;
    flex-direction:column;
    width: 20%;
    height: 60%;
    align-items:center;
    /* justify-content: space-evenly; */
    
    `
const Description = styled.div`
position:absolute;
top: 15%;
left:50%;
transform: translate(-50%, -50%);

min-width: 650px;
min-height: 250px;
background-color:black;
`
const Toggle = styled.div`
    display:flex;
    flex-direction:row;
    border-bottom:1px solid black;  
    width:100%;
    height:10%;
    justify-content:space-evenly;
    div{
        padding: 13px 0 0 0;
        font-weight:bold;
        width:50%;
        text-align:center;
    }
    `

    const LoginContainer = styled.div`

    width: 100%;
    height:90%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-evenly;
    form{
        width: 80%;
    }
`

const LoginButton = styled.button`
width: 100%;
height:33px;
margin: 20px 0 0 0;
background-color:black;
color:white;
border:none;
box-shadow: 0 0 2px 2px inset black;
border-radius:5px;
cursor: pointer;
&:hover{
    background-color: white;
    box-shadow: 0 0 2px 2px inset white;
    color:black;
    border:1px solid black;
}
`
const InputDiv = styled.div`
    min-height: 60px;
    display:flex;
    flex-direction:column;
    margin: 10px 0 0 0;
    label{
        color:grey;
        font-size:0.8rem;
        margin: 0 0 5px 0%;
    }
    input{
        height:35px;
        border:none;
    box-shadow: 0 0 1px 1px inset grey;
    border-radius:5px;
    }
`


   const RegisterContainer = styled.div`

    width: 60%;
    height:80%;
    align-items:center;
    justify-content:center;
`

const RegisterButton = styled.button`
width: 100%;
height:33px;
margin: 20px 0 0 0;
background-color:black;
color:white;
border:none;
box-shadow: 0 0 2px 2px inset black;
border-radius:5px;
cursor: pointer;
&:hover{
    background-color: white;
    box-shadow: 0 0 2px 2px inset white;
    color:black;
    border:1px solid black;
}
`

