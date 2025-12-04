"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import dynamic from "next/dynamic";
import WindowDetail from "../components/window-detail";
import { useWindowEstimation } from "../hooks/useWindowEstimation";
import {
  pipeTypeToComponentMapping,
  SpdpDetail,
} from "../constants/pipeTypeMapping";
import BackButton from "../utility/BackButton";
import UChannelDetail from "../components/uchannel-detail";

const MaterialPrice = dynamic(
  () => import("@/app/(ui)/components/material-price"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);

const EstimationDetail = dynamic(
  () => import("@/app/(ui)/components/estimation-detail"),
  {
    loading: () => (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading estimation...</span>
        </div>
      </div>
    ),
    ssr: false,
  },
);

export default function WindowTypePage() {
  const params = useParams();
  const windowId = Number(params["id"]);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  const toggleZoom = () => {
    setIsZoomedOut(!isZoomedOut);
    if (!isZoomedOut) {
      document.body.style.zoom = "75%";
    } else {
      document.body.style.zoom = "100%";
    }
  };

  const {
    showAdditionalSections,
    showEstimationDetailView,
    setShowEstimationDetailView,
    materialList,
    windowType,
    pipeType,
    pipeDetail,
    isLoading,
    setIncludeSpDpSchema,
    materialWithType,
    materialWithoutType,
    materialEstimationData,
    selectedSpOrDpPipe,
    showUChannelPipeDetails,
    setIncludeUChannelDetail,
    methods,
    onSubmit,
    openMaterialAdditionalSections,
  } = useWindowEstimation(windowId);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Dynamic component generation
  const pipeDetailComponents = useMemo(() => {
    if (!isLoading && windowType && windowType in pipeTypeToComponentMapping) {
      let components = [...pipeTypeToComponentMapping[windowType]];

      //Add SpdpDetail component conditionally
      if (selectedSpOrDpPipe === "SP" || selectedSpOrDpPipe === "DP") {
        if (!components.includes(SpdpDetail)) components.push(SpdpDetail);
        setIncludeSpDpSchema(true);
      } else {
        components = components.filter((c) => c !== SpdpDetail);
        setIncludeSpDpSchema(false);
      }

      //Add UChannelDetail component conditionally
      if (showUChannelPipeDetails) {
        if (!components.includes(UChannelDetail))
          components.push(UChannelDetail);
        setIncludeUChannelDetail(true);
      } else {
        components = components.filter((c) => c !== UChannelDetail);
        setIncludeUChannelDetail(false);
      }

      return components.map((Component, index) => (
        <div
          className="row main-container"
          style={{ marginTop: "1.5rem" }}
          key={`component-${index}`}
        >
          <Component pipeType={pipeType} pipeDetail={pipeDetail} />
        </div>
      ));
    }
    return [];
  }, [
    isLoading,
    windowType,
    pipeType,
    pipeDetail,
    selectedSpOrDpPipe,
    setIncludeSpDpSchema,
    showUChannelPipeDetails,
    setIncludeUChannelDetail,
  ]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="window-fixed-top text-center">
        {showEstimationDetailView && (
          <BackButton
            onClick={() => setShowEstimationDetailView(false)}
            position="start-0 ms-3"
            buttonName="Back"
          />
        )}
        <h4 className="mb-0">{windowType}</h4>
        <BackButton
          onClick={() => toggleZoom()}
          position="end-0 me-3"
          buttonName={isZoomedOut ? "100%" : "75%"}
        />
      </div>

      <div
        style={
          showEstimationDetailView ? { display: "none" } : { display: "block" }
        }
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row main-container" style={{ marginTop: "70px" }}>
              <WindowDetail
                onEstimateMaterial={openMaterialAdditionalSections}
              />
            </div>

            {showAdditionalSections && (
              <div>
                {pipeDetailComponents}

                <div
                  className="row main-container"
                  style={{ marginTop: "1.5rem" }}
                >
                  <MaterialPrice
                    materialWithType={materialWithType}
                    materialWithoutType={materialWithoutType}
                  />
                </div>

                <div
                  className="row main-container"
                  style={{ marginTop: "1.5rem" }}
                >
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Get Window Estimation"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </div>

      {showEstimationDetailView && (
        <div style={{ marginTop: "70px" }}>
          <EstimationDetail
            materialList={materialList}
            windowType={windowType}
            inputData={materialEstimationData}
          />
        </div>
      )}
    </>
  );
}
