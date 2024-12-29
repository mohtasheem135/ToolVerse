import Image from "next/image";
import React from "react";

const WorkInProgress = () => {
  return (
    
    <div className="flex flex-col justify-center items-center">
      <Image src="/wip.jpg" width={550} height={400} className="mt-10" alt="Work In Progress" />
      <p className="mt-5 text-[30px]">I am working on this tool...</p>
    </div>
  );
};

export default WorkInProgress;
