import Sidebar from "../../components/sidebar/Sidebar.js";
import MessageContainer from "../../components/messages/MessageContainer.js";

const Home = () => {
    return (
        <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden  bg-clip-padding 
            backdrop-filter backdrop-blur-sm bf-opacity-0">
            <Sidebar/>
            <MessageContainer/>
        </div>
    );
};
export default Home;