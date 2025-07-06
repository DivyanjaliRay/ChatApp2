import SearchInput from "./SearchInput.js";
import Conversations from "./Conversations.js";
import LogoutButton from "./LogoutButton.js";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col justify-center items-center bg-transparent">

        <SearchInput/> 
        <div className="divider px-3"></div>
         <Conversations/> 
          <LogoutButton/>


    </div>
  );
};

export default Sidebar;


// import SearchInput from "./SearchInput.js";
// import Conversations from "./Conversations.js";
// import LogoutButton from "./LogoutButton.js";

// const Sidebar = () => {
//   return (
//     <div className="border-r border-slate-500 p-4 flex flex-col">

//         <SearchInput/>
//         <div classNmae="divider px-3"></div>
//          <Conversations/> 
//           <LogoutButton/>

//     </div>
//   );
// };

// export default Sidebar;