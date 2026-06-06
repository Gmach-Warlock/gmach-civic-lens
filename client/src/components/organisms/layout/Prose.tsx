import React from "react";
import Column from "./Column";

interface ProseProps {
  children: React.ReactNode;
}

const Prose: React.FC<ProseProps> = ({ children }) => {
  return (
    <Column variant="start" gap={0} className="prose">
      {children}
    </Column>
  );
};

export default Prose;
