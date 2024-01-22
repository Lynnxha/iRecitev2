import React from "react";
import AdSense from "react-adsense";

const MyAd = () => (
  <div>
    <AdSense.Google
      client="pub-2662894778043128"
      slot="2335003468"
      style={{ display: "block" }}
      format="auto"
      responsive="true"
    />
  </div>
);

export default MyAd;
