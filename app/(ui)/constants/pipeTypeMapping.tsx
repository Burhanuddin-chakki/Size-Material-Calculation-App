import dynamic from "next/dynamic";

const TrackDetail = dynamic(
  () => import("@/app/(ui)/components/track-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
const ShutterDetail = dynamic(
  () => import("@/app/(ui)/components/shutter-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
const InterLockDetail = dynamic(
  () => import("@/app/(ui)/components/interlock-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
const VChannelDetail = dynamic(
  () => import("@/app/(ui)/components/vchannel-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
const TrackTopDetail = dynamic(() => import("../components/track-top-detail"), {
  loading: () => (
    <div className="text-center p-3">
      <div className="spinner-border spinner-border-sm" role="status"></div>
    </div>
  ),
});
const TrackBottomDetail = dynamic(
  () => import("../components/track-bottom-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
const HandleDetail = dynamic(() => import("../components/handle-detail"), {
  loading: () => (
    <div className="text-center p-3">
      <div className="spinner-border spinner-border-sm" role="status"></div>
    </div>
  ),
});
const LongBearingDetail = dynamic(
  () => import("../components/long-bearing-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);
export const SpdpDetail = dynamic(
  () => import("@/app/(ui)/components/spdp-detail"),
  {
    loading: () => (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status"></div>
      </div>
    ),
  },
);

export const pipeTypeToComponentMapping: Record<
  string,
  Array<React.ComponentType<any>>
> = {
  "3 Track Domal": [TrackDetail, ShutterDetail, InterLockDetail],
  "2 Track Domal": [TrackDetail, ShutterDetail, InterLockDetail],
  "3 Track Deep Domal": [
    TrackDetail,
    ShutterDetail,
    InterLockDetail,
    VChannelDetail,
  ],
  "2 Track Deep Domal": [
    TrackDetail,
    ShutterDetail,
    InterLockDetail,
    VChannelDetail,
  ],
  "3 Track Mini Domal": [TrackDetail, ShutterDetail, InterLockDetail],
  "2 Track Mini Domal": [TrackDetail, ShutterDetail, InterLockDetail],
  "2 Track Normal": [
    TrackTopDetail,
    TrackBottomDetail,
    HandleDetail,
    InterLockDetail,
    LongBearingDetail,
  ],
  "3 Track Normal": [
    TrackTopDetail,
    TrackBottomDetail,
    HandleDetail,
    InterLockDetail,
    LongBearingDetail,
  ],
  "2 Track 18/60": [
    TrackTopDetail,
    TrackBottomDetail,
    HandleDetail,
    InterLockDetail,
    LongBearingDetail,
  ],
  "3 Track 18/60": [
    TrackTopDetail,
    TrackBottomDetail,
    HandleDetail,
    InterLockDetail,
    LongBearingDetail,
  ],
};
