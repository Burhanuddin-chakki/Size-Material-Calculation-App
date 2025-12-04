import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MaterialType, PipeDetailType, PipeType } from "@/types";
import {
  fetchMaterialList,
  fetchPipeDetail,
  fetchPipeType,
  fetchWindowfromWindowId,
} from "@/app/api/window";
import {
  getDefaultFormValues,
  getMaterialSchema,
  getSchemaForWindowsPipe,
} from "@/app/(ui)/services/schema.service";
import { spdpPipeSchema } from "@/app/(ui)/components/spdp-detail";
import { uChannelPipeSchema } from "../components/uchannel-detail";

export const useWindowEstimation = (windowId: number) => {
  // State
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [showEstimationDetailView, setShowEstimationDetailView] =
    useState(false);
  const [numberOfTrack, setNumberOfTrack] = useState<number>(2);
  const [materialList, setMaterialList] = useState<MaterialType[]>([]);
  const [windowType, setWindowType] = useState<string>("");
  const [windowGroup, setWindowGroup] = useState<string>("");
  const [pipeType, setPipeType] = useState<PipeType[]>([]);
  const [pipeDetail, setPipeDetail] = useState<PipeDetailType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [includeSpDpSchema, setIncludeSpDpSchema] = useState(false);
  const [includeUChannelDetail, setIncludeUChannelDetail] = useState(false);
  const [showUChannelSections, setShowUChannelSections] = useState(false);
  const [materialWithType, setMaterialWithType] = useState<MaterialType[]>([]);
  const [materialWithoutType, setMaterialWithoutType] = useState<
    MaterialType[]
  >([]);
  const [materialEstimationData, setMaterialEstimationData] =
    useState<any>(null);

  // Material categorization
  useEffect(() => {
    if (materialList.length > 0) {
      const withType: MaterialType[] = [];
      const withoutType: MaterialType[] = [];
      materialList.forEach((item) => {
        if (item.type && item.type.length > 0) {
          if (item.field !== "uChannel") {
            withType.push(item);
          } else if (showUChannelSections) {
            withType.push(item);
          }
        } else {
          withoutType.push(item);
        }
      });
      setMaterialWithType(withType);
      setMaterialWithoutType(withoutType);
    }
  }, [materialList, showUChannelSections]);

  // Dynamic schema
  const parentSchema = useMemo(() => {
    let schema = z.object({});
    schema = schema.extend({
      ...getSchemaForWindowsPipe(windowType).shape,
      ...getMaterialSchema(materialList, showUChannelSections).shape,
    });

    if (includeSpDpSchema) {
      schema = schema.extend({
        ...spdpPipeSchema.shape,
      });
    }
    if (includeUChannelDetail) {
      schema = schema.extend({
        ...uChannelPipeSchema.shape,
      });
    }

    return schema;
  }, [
    windowType,
    materialList,
    includeSpDpSchema,
    includeUChannelDetail,
    showUChannelSections,
  ]);

  type FormData = z.infer<typeof parentSchema>;

  // Form methods
  const methods = useForm<FormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {},
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { watch } = methods;
  const selectedSpOrDpPipe = (watch as any)("selectedSpOrDpPipe") as
    | "SP"
    | "DP"
    | "none"
    | undefined;

  // Watch form values to trigger recalculation
  const isContainMacharJali = (watch as any)("isContainMacharJali");
  const isContainGrillJali = (watch as any)("isContainGrillJali");

  const showUChannelPipeDetails: boolean = useMemo(() => {
    if (!windowGroup) return false;
    const temp =
      ["Domal", "Mini Domal", "Deep Domal"].includes(windowGroup) &&
      isContainMacharJali &&
      !isContainGrillJali;
    return temp;
  }, [windowGroup, isContainMacharJali, isContainGrillJali]);
  const showUChannelSectionDetail = isContainMacharJali && !isContainGrillJali;

  // Update form resolver when schema changes
  useEffect(() => {
    if (!isLoading) {
      methods.clearErrors();
    }
  }, [parentSchema, isLoading, methods]);

  useEffect(() => {
    setShowUChannelSections(showUChannelSectionDetail);
  }, [showUChannelSectionDetail]);

  // Data fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [windowDetail, pipes, details] = await Promise.all([
        fetchWindowfromWindowId(windowId),
        fetchPipeType(),
        fetchPipeDetail(windowId),
      ]);
      setWindowType(windowDetail.windowType);
      setWindowGroup(windowDetail.windowGroup);
      setNumberOfTrack(windowDetail.windowTrack);
      setPipeType(pipes);
      setPipeDetail(details);

      const materials = await fetchMaterialList(
        windowId,
        windowDetail.windowGroup,
      );

      setMaterialList(materials);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [windowId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset form after data loads
  useEffect(() => {
    if (!isLoading && windowType && pipeType.length > 0) {
      const newDefaults = getDefaultFormValues(windowType, pipeType);
      methods.reset(newDefaults, {
        keepDefaultValues: false,
        keepValues: false,
      });
    }
  }, [isLoading, windowType, pipeType, methods]);

  // Handlers
  const onSubmit = async (data: FormData) => {
    const inputObject: any = { ...data };
    inputObject["numberOfTrack"] = Number(numberOfTrack);
    inputObject["windowGroup"] = windowGroup;
    inputObject["showUChannelPipeDetails"] = showUChannelPipeDetails;
    setMaterialEstimationData(inputObject);
    setShowEstimationDetailView(true);
  };

  const openMaterialAdditionalSections = () => {
    methods.trigger(["height", "width"] as any).then((isValid) => {
      if (isValid) {
        setShowAdditionalSections(true);
      }
    });
  };

  return {
    // State
    showAdditionalSections,
    showEstimationDetailView,
    setShowEstimationDetailView,
    numberOfTrack,
    materialList,
    windowType,
    windowGroup,
    pipeType,
    pipeDetail,
    isLoading,
    includeSpDpSchema,
    setIncludeSpDpSchema,
    materialWithType,
    materialWithoutType,
    materialEstimationData,
    selectedSpOrDpPipe,
    showUChannelPipeDetails,
    setIncludeUChannelDetail,

    // Form
    methods,
    parentSchema,

    // Handlers
    onSubmit,
    openMaterialAdditionalSections,
  };
};
