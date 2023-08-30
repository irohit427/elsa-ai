import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/mobileSidebar";
import { getApiLimitCount } from "@/lib/apiLimit";

const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  return ( 
    <div className="flex items-center p-4">
      <MobileSidebar 
        apiLimitCount={apiLimitCount}
      />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
   );
}
 
export default Navbar;