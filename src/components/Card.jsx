import { div } from "framer-motion/client";


const Card = ({ children , className="", style = {}, ...rest}) => (
  <div className="row wrapper">
    <div className={className} style={style} {...rest}>
    {children}
  </div></div>
  );
  
  const CardContent = ({ children }) => <div>{children}</div>;
  
  export { Card, CardContent };
  