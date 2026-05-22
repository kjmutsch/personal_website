// Persistent iris-transition overlay; reads the Redux trigger and survives route changes.
"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Iris from "./Iris";

const IrisOverlay = () => {
  const [mounted, setMounted] = useState(false);
  const isIrisActive = useSelector((state: RootState) => state.app.isIrisActive);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <Iris trigger={mounted && isIrisActive} />;
};

export default IrisOverlay;
