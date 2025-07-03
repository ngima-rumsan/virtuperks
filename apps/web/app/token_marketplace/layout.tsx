import SuperAdminNav from "@/components/layout/nav/super_admin.nav";
import Validation from "@/providers/validation";
import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      
    {children}
      
    </div>
  );
};

export default layout;
