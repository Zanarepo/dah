import React from "react";
import HeaderSection from "./HeaderSection";
import FeaturesSection from "./FeaturesSection";
import DashboardPreview from "./DashboardPreview";
import CallToAction from "./CallToAction";
import WhyDatafy from "./WhyDatafy";  // Import the WhyDatafy component
import QuickActionPopup from "../profile/QuickActionPopup";


const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <HeaderSection />
      <QuickActionPopup/>
      {/* Why Datafy Section */}
      <WhyDatafy />  {/* Insert WhyDatafy here */}

      {/* Features Section */}
      <FeaturesSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Call to Action */}
      <CallToAction />
      
    </div>

  );
};

export default HomePage;
