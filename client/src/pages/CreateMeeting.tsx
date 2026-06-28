import axios from "axios";
import { useNavigate } from "react-router-dom";


function CreateMeeting(){

const navigate=useNavigate();


const user=JSON.parse(

localStorage.getItem("user")

|| "{}"

);



const createMeeting=async()=>{


const roomId=

"vartalap-"

+

Date.now();



await axios.post(

"http://localhost:5000/api/meetings",

{

roomId,

createdBy:user.name,

creatorEmail:user.email

}

);



navigate(

`/meeting/${roomId}`

);


};



return(


<div

style={{

minHeight:"100vh",

display:"grid",

placeItems:"center",

background:"#020617"

}}

>


<div

style={{

padding:"40px",

borderRadius:"20px",

background:"#1e293b"

}}

>


<h1>

🎥 Create Meeting

</h1>



<button

onClick={createMeeting}


style={{

padding:"15px",

border:"none",

borderRadius:"10px",

cursor:"pointer"

}}

>


Start Meeting


</button>


</div>


</div>


);


}


export default CreateMeeting;