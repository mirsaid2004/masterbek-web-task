import TheaterRoot from "./Theater";
import TheaterBadge from "./TheaterBadge";
import TheaterTopBar from "./TheaterTopBar";
import TheaterStatus from "./TheaterStatus";
import TheaterMicrophone from "./TheaterMicrophone";
import TheatreActions from "./TheatreActions";
import TheaterActionButton from "./TheatreActionButton";

// Compound Component Pattern
const Theater = Object.assign(TheaterRoot, {
  Badge: TheaterBadge,
  TopBar: TheaterTopBar,
  Status: TheaterStatus,
  Microphone: TheaterMicrophone,
  Actions: TheatreActions,
  ActionButton: TheaterActionButton,
});

export default Theater;
