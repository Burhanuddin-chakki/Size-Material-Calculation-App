import CreateEstimationPage from "../(ui)/page";
import WindowEstimation from "../window-estimation";

// const containerFluid = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

const innerContainer: React.CSSProperties = {
  // textAlign: "center",
  marginLeft: "0px",
  marginRight: "0px",
  maxWidth: "95%",
}

export default function Home() {
  return (
    <>
      <div>
          <div className="container mt-4" style={innerContainer}>
            <CreateEstimationPage />
            {/* <WindowEstimation /> */}
          </div>
      </div>
    </>


  );
}
