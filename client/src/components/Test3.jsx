import React, { useState,useEffect} from 'react'
import usestore from '../../store/store'
import {Link} from 'react-router-dom'
import axios from '../../plugin/axios'
import { NotionRenderer } from 'react-notion';
import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import { parse, stringify, toJSON, fromJSON } from "flatted";
// https://furtive-lemming-021.notion.site/5238c13f4457483594104ea57d2e6e59
//https://furtive-lemming-021.notion.site/dsfa-5238c13f4457483594104ea57d2e6e59
function Test3() {
    const { isAdmin } = usestore()
    const [blockMap, setBlockMap] = useState({})
    useEffect(() => { 
    const eventSource = new EventSource("http://localhost:5000/notion", {withCredentials:true})     
        eventSource.onmessage = (e) => {
            console.log(e.data)
            setBlockMap(parse(e.data))
        }
    },[])
  return (
      <div>
        여기에 노션땡겨오고 로그아웃 리모콘으로 따라댕기도록 관리자페이지도하나작업하고 그거위해서 토큰payload에 role도 실어서보내자 adminroute가true고 payload.role이 어드민이면 그기로 빠지도록
          <div>{isAdmin ? <Link to='/admin'>관리자페이지로</Link> : ''}</div>
           <NotionRenderer
            fullPage={true}
            blockMap={blockMap}
            />
    </div>
  )
}

export default Test3