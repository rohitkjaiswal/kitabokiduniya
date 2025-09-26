import { div } from "framer-motion/client";

const Card = ({ children , className=""}) => (
  <div className="container  wrapper flex-row">
    <div className={` border shadow p-1 w-50 ${className}`}>{children}</div></div>
  );
  
  const CardContent = ({ children }) => <div>{children}</div>;
  
  export { Card, CardContent };
  