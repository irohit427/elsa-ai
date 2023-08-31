import { LandingContent } from "./components/landingContent";
import { LandingHero } from "./components/landingHero";
import { LandingNavbar } from "./components/landingNavbar";

const LandingPage = () => {
  return ( 
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
   );
}
 
export default LandingPage;