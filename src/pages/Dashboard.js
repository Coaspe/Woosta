import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Sidebar from "../components/sidebar/index";
import Timeline from "../components/Timeline";
import Posting from "./Posting";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Woosta";
  }, []);
  const [modal, setModal] = useState(false);
  const divRef = useRef(null);

  console.log(modal);
  return (
    <div className="bg-gray-background">
      <Header setModal={setModal} divRef={divRef} />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <Timeline />
        <Sidebar />
      </div>
      {modal ? <Posting setModal={setModal} divRef={divRef} /> : null}
    </div>
  );
};

export default Dashboard;
