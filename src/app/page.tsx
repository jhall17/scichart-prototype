import RenderedChart from "../components/RenderedChart";
import NoSsr from "../components/NoSsr";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <NoSsr>
        <RenderedChart />
      </NoSsr>
    </div>
  );
}
